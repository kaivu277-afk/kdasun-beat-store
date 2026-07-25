import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = ["index.html","style.css","app.js","data.js","admin.html","admin.css","admin.js"];
const failures = [];
const read = file => fs.readFileSync(path.join(root,file),"utf8");
const check = (condition,message) => { if(!condition) failures.push(message); };

for(const file of required) check(fs.existsSync(path.join(root,file)),`Thiếu file ${file}`);
for(const file of required.filter(file => fs.existsSync(path.join(root,file)))) {
  const content=read(file);
  check(!/(?:Ã[\x80-\xBF]|Â[·©®]|â[€š€™œž]|�)/.test(content),`${file} còn lỗi mã hóa`);
}

for(const htmlFile of ["index.html","admin.html"]) {
  const html=read(htmlFile);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  check(new Set(ids).size===ids.length,`${htmlFile} có ID trùng`);
  const refs=[...html.matchAll(/\s(?:src|href)="([^"]+)"/g)].map(match=>match[1]).filter(ref=>!/^(?:https?:|mailto:|tel:|#)/.test(ref));
  for(const ref of refs) check(fs.existsSync(path.join(root,ref)),`${htmlFile} tham chiếu file không tồn tại: ${ref}`);
}

const scripts=read("app.js")+read("admin.js");
check(!/\balert\s*\(/.test(scripts),"Còn dùng alert()");
check(!/(?:password|mật khẩu)\s*[:=]\s*["'][^"']+/i.test(scripts),"Có dấu hiệu mật khẩu hard-code");
check(!/\bonclick=/.test(read("index.html")+read("admin.html")),"Có inline onclick");
check(!/href=["']admin\.html["']/.test(read("index.html")),"Trang khách còn hiển thị liên kết quản trị");
check(!/<aside[\s>]/.test(read("index.html")),"Trang khách còn dùng sidebar kiểu quản trị");
check(/id=["']beats["']/.test(read("index.html")) && /id=["']cartOpen["']/.test(read("index.html")),"Trang khách thiếu kho beat hoặc giỏ hàng");

if(failures.length){console.error(failures.map(item=>`- ${item}`).join("\n"));process.exit(1);}
console.log("Kiểm tra tĩnh đạt: đủ 7 file chính, mã hóa/đường dẫn/ID/JavaScript an toàn.");
