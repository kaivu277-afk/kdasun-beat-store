import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "style.css"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
check(duplicateIds.length === 0, `ID bị trùng: ${[...new Set(duplicateIds)].join(", ")}`);
const fragmentLinks = [...html.matchAll(/\shref="#([^"]+)"/g)].map(match => match[1]);
for (const fragment of fragmentLinks) {
  check(ids.includes(fragment), `Anchor không có đích: #${fragment}`);
}

const localReferences = [...html.matchAll(/\s(?:src|href)="([^"]+)"/g)]
  .map(match => match[1])
  .filter(reference => !/^(?:https?:|mailto:|tel:|#)/.test(reference));
for (const reference of localReferences) {
  check(fs.existsSync(path.join(root, reference)), `Thiếu tài nguyên: ${reference}`);
}

for (const [name, content] of Object.entries({ "index.html": html, "style.css": css, "app.js": app })) {
  check(!/(?:Ã[\x80-\xBF]|Â[·©®]|â[€š€™œž]|�)/.test(content), `${name} còn chuỗi lỗi mã hóa`);
}

check(!/href="#"/.test(html), "Có link # không có đích");
check(!/\bonclick=/.test(html), "Có inline onclick");
check(!/\balert\s*\(/.test(app), "app.js còn dùng alert()");
check(!/0900000000/.test(html + app), "Còn số điện thoại giả");
check(html.includes('lang="vi"'), "Thiếu ngôn ngữ tiếng Việt");
check(html.includes("<main"), "Thiếu thẻ main");
check(html.includes("<header"), "Thiếu thẻ header");
check(html.includes("<footer"), "Thiếu thẻ footer");
check(html.includes("manifest.webmanifest"), "Thiếu manifest");
check(html.includes("application/ld+json"), "Thiếu structured data");
check(app.includes("HTMLAudioElement") || html.includes("<audio"), "Thiếu audio element");
check(app.includes("localStorage"), "Thiếu lưu localStorage");
check(css.includes("prefers-reduced-motion"), "Thiếu hỗ trợ reduced motion");
check(css.includes("@media (max-width: 620px)"), "Thiếu breakpoint mobile");
check(css.includes("@media (max-width: 900px)"), "Thiếu breakpoint tablet");

if (failures.length) {
  console.error(`Kiểm tra tĩnh thất bại (${failures.length}):`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Kiểm tra tĩnh đạt: ${ids.length} ID duy nhất, ${fragmentLinks.length} anchor và ${localReferences.length} tài nguyên nội bộ hợp lệ.`);
