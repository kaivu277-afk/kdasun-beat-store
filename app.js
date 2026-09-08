(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const config = window.KDASUN_CONFIG || {};
  const projects = Array.isArray(window.KDASUN_PROJECTS) ? window.KDASUN_PROJECTS : [];
  const defaultBeats = Array.isArray(window.KDASUN_BEATS) ? window.KDASUN_BEATS : [];
  const storedBeats = readJson("kd_admin", null);
  const beats = normalizeBeats(Array.isArray(storedBeats) && storedBeats.length ? storedBeats : defaultBeats);
  const favorites = new Set(safeArray(readJson("kd_f", [])));
  let selections = safeArray(readJson("kd_c", [])).filter(id => beats.some(beat => beat.id === id));
  const audio = new Audio();
  audio.preload = "metadata";
  let activeBeatId = "";
  let toastTimer;

  function safeArray(value) { return Array.isArray(value) ? value : []; }
  function readJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
  function saveState() {
    try {
      localStorage.setItem("kd_f", JSON.stringify([...favorites]));
      localStorage.setItem("kd_c", JSON.stringify(selections));
    } catch { showToast("Trình duyệt không thể lưu lựa chọn lúc này."); }
  }
  function normalizeBeats(list) {
    return list.map((beat, index) => ({
      id:String(beat.id || `beat-${index + 1}`), title:String(beat.title || "Beat chưa đặt tên"), producer:String(beat.producer || "Lò Văn Lâm"),
      genre:String(beat.genre || "Chưa phân loại"), mood:String(beat.mood || ""), bpm:Number(beat.bpm) || 0, key:String(beat.key || "—"),
      price:Math.max(0, Number(beat.price) || 0), theme:String(beat.theme || beat.t || ""), description:String(beat.description || beat.desc || ""),
      coverUrl:String(beat.coverUrl || ""), previewUrl:String(beat.previewUrl || ""), featured:Boolean(beat.featured), exclusive:Boolean(beat.exclusive)
    }));
  }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[char]); }
  function formatMoney(value) { return value === 0 ? "Liên hệ" : `${new Intl.NumberFormat("vi-VN").format(value)}đ`; }
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2700);
  }

  function renderProjects() {
    $("#projectGrid").innerHTML = projects.slice(0, 6).map((project, index) => `
      <a class="project-card" href="https://www.youtube.com/watch?v=${encodeURIComponent(project.id)}" target="_blank" rel="noopener noreferrer" aria-label="Phát ${escapeHtml(project.title)} trên YouTube">
        <img src="${escapeHtml(project.image)}" width="1280" height="720" loading="lazy" alt="Ảnh bìa ${escapeHtml(project.title)}">
        <span class="project-copy"><small>${index === 0 ? "MỚI NHẤT · " : ""}${escapeHtml(project.category)}</small><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.subtitle)}</p></span>
        <span class="project-play" aria-hidden="true">▶</span>
      </a>`).join("");
  }

  function filteredBeats() {
    const query = $("#search").value.trim().toLocaleLowerCase("vi");
    const genre = $("#genre").value;
    return beats.filter(beat => {
      const haystack = `${beat.title} ${beat.producer} ${beat.genre} ${beat.mood} ${beat.bpm} ${beat.key}`.toLocaleLowerCase("vi");
      return (!query || haystack.includes(query)) && (!genre || beat.genre === genre);
    });
  }
  function renderBeats() {
    const list = filteredBeats();
    $("#resultNote").textContent = `Hiển thị ${list.length} / ${beats.length} beat`;
    $("#grid").innerHTML = list.length ? list.map(beat => `
      <article class="beat-card">
        <div class="beat-art ${escapeHtml(beat.theme)}">
          ${beat.coverUrl ? `<img class="beat-cover" src="${escapeHtml(beat.coverUrl)}" alt="Ảnh bìa ${escapeHtml(beat.title)}" loading="lazy">` : ""}
          <span class="beat-tag">${beat.previewUrl ? "CÓ BẢN NGHE THỬ" : "CHƯA CÓ PREVIEW"}</span>
          <button class="beat-play" type="button" data-play="${escapeHtml(beat.id)}" aria-label="${beat.previewUrl ? "Nghe thử" : "Kiểm tra bản nghe thử của"} ${escapeHtml(beat.title)}">▶</button>
        </div>
        <div class="beat-body">
          <div class="beat-title-row"><h3>${escapeHtml(beat.title)}</h3><button class="favorite-button ${favorites.has(beat.id) ? "on" : ""}" type="button" data-favorite="${escapeHtml(beat.id)}" aria-label="${favorites.has(beat.id) ? "Bỏ khỏi" : "Thêm vào"} yêu thích">${favorites.has(beat.id) ? "♥" : "♡"}</button></div>
          <small class="beat-meta">${escapeHtml(beat.genre)} · ${beat.bpm || "—"} BPM · ${escapeHtml(beat.key)}${beat.mood ? ` · ${escapeHtml(beat.mood)}` : ""}</small>
          <p class="beat-description">${escapeHtml(beat.description || "Beat tuyển chọn từ Lò Văn Lâm Âm Nhạc Thái.")}</p>
          <div class="beat-bottom"><span class="beat-price"><small>Giá tham khảo từ</small><b>${formatMoney(beat.price)}</b></span><button class="choose-beat" type="button" data-select="${escapeHtml(beat.id)}">${selections.includes(beat.id) ? "Đã chọn ✓" : "Chọn beat +"}</button></div>
        </div>
      </article>`).join("") : `<div class="empty-state"><b>Không tìm thấy beat phù hợp.</b><span>Hãy thử từ khóa hoặc thể loại khác.</span></div>`;
  }

  function setupGenreOptions() {
    [...new Set(beats.map(beat => beat.genre))].sort((a,b) => a.localeCompare(b,"vi")).forEach(genre => {
      const option = document.createElement("option"); option.value = genre; option.textContent = genre; $("#genre").append(option);
    });
  }
  function playBeat(id) {
    const beat = beats.find(item => item.id === id);
    if (!beat) return;
    if (!beat.previewUrl) { showToast("Beat này chưa có bản nghe thử. Hãy hỏi Lò Văn Lâm qua Zalo."); return; }
    if (activeBeatId === id && !audio.paused) { audio.pause(); return; }
    audio.pause(); audio.src = beat.previewUrl; activeBeatId = id;
    audio.play().catch(() => showToast("Không thể phát file audio. Hãy kiểm tra đường dẫn preview."));
  }

  function renderDrawer() {
    const chosen = selections.map(id => beats.find(beat => beat.id === id)).filter(Boolean);
    $("#drawerBody").innerHTML = chosen.length ? chosen.map(beat => `<article class="drawer-item"><span class="drawer-cover"></span><div><b>${escapeHtml(beat.title)}</b><small>${escapeHtml(beat.genre)} · ${formatMoney(beat.price)}</small></div><button type="button" data-remove="${escapeHtml(beat.id)}" aria-label="Xóa ${escapeHtml(beat.title)}">×</button></article>`).join("") : `<p class="drawer-empty">Bạn chưa chọn beat nào. Hãy chọn beat rồi gửi danh sách qua Zalo để được tư vấn giấy phép.</p>`;
  }
  function openDrawer() {
    renderDrawer();
    $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden","false"); $("#backdrop").hidden = false; document.body.classList.add("drawer-open"); $("#drawerClose").focus();
  }
  function closeDrawer() {
    $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden","true"); $("#backdrop").hidden = true; document.body.classList.remove("drawer-open");
  }

  function validZaloUrl(value) {
    try { const url = new URL(value); return url.protocol === "https:" && (url.hostname === "zalo.me" || url.hostname.endsWith(".zalo.me") || url.hostname === "zaloapp.com"); } catch { return false; }
  }
  function setupZaloLinks() {
    const valid = validZaloUrl(config.zaloUrl || "");
    $$('[data-zalo-link]').forEach(link => {
      if (valid) { link.href = config.zaloUrl; link.target = "_blank"; link.rel = "noopener noreferrer"; }
      else link.addEventListener("click", event => { event.preventDefault(); closeDrawer(); const dialog = $("#contactDialog"); if (typeof dialog.showModal === "function") dialog.showModal(); else showToast("Chưa cấu hình link Zalo thật trong config.js."); });
    });
  }

  function openSupportDialog() {
    toggleMenu(true);
    const dialog = $("#supportDialog");
    if (typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
  }
  function closeSupportDialog() {
    const dialog = $("#supportDialog");
    if (dialog.open) dialog.close();
  }
  async function copyAccountNumber() {
    const accountNumber = String(config.support?.accountNumber || $("#supportAccount")?.textContent || "").trim();
    if (!accountNumber) return showToast("Chưa có số tài khoản để sao chép.");
    try {
      await navigator.clipboard.writeText(accountNumber);
      showToast("Đã sao chép số tài khoản 0020110128801.");
    } catch {
      const field = document.createElement("textarea");
      field.value = accountNumber; field.setAttribute("readonly", ""); field.style.position = "fixed"; field.style.opacity = "0";
      document.body.append(field); field.select();
      const copied = document.execCommand("copy"); field.remove();
      showToast(copied ? "Đã sao chép số tài khoản." : "Không thể sao chép. Hãy nhấn giữ số tài khoản.");
    }
  }

  function toggleMenu(forceClose = false) {
    const menu = $("#mobileMenu"), button = $("#menuToggle");
    const shouldOpen = !forceClose && menu.hidden;
    menu.hidden = !shouldOpen; button.setAttribute("aria-expanded",String(shouldOpen)); button.setAttribute("aria-label",shouldOpen ? "Đóng menu" : "Mở menu"); document.body.classList.toggle("menu-open",shouldOpen);
  }

  renderProjects(); setupGenreOptions(); renderBeats(); setupZaloLinks();
  $("#year").textContent = String(new Date().getFullYear());
  $("#search").addEventListener("input", renderBeats); $("#genre").addEventListener("change", renderBeats);
  $("#menuToggle").addEventListener("click", () => toggleMenu());
  $$("#mobileMenu a").forEach(link => link.addEventListener("click", () => toggleMenu(true)));
  $("#drawerClose").addEventListener("click", closeDrawer); $("#backdrop").addEventListener("click", closeDrawer);
  $$('[data-close-dialog]').forEach(button => button.addEventListener("click", () => $("#contactDialog").close()));
  $$('[data-support-open]').forEach(button => button.addEventListener("click", openSupportDialog));
  $$('[data-support-close]').forEach(button => button.addEventListener("click", closeSupportDialog));
  $("[data-copy-account]").addEventListener("click", copyAccountNumber);
  $("#contactDialog").addEventListener("click", event => { if (event.target === $("#contactDialog")) $("#contactDialog").close(); });
  $("#supportDialog").addEventListener("click", event => { if (event.target === $("#supportDialog")) closeSupportDialog(); });
  window.addEventListener("scroll", () => $(".site-header").classList.toggle("scrolled", window.scrollY > 10), {passive:true});
  document.addEventListener("click", event => {
    const play = event.target.closest("[data-play]"), favorite = event.target.closest("[data-favorite]"), select = event.target.closest("[data-select]"), remove = event.target.closest("[data-remove]");
    if (play) playBeat(play.dataset.play);
    if (favorite) { favorites.has(favorite.dataset.favorite) ? favorites.delete(favorite.dataset.favorite) : favorites.add(favorite.dataset.favorite); saveState(); renderBeats(); showToast(favorites.has(favorite.dataset.favorite) ? "Đã thêm vào yêu thích." : "Đã bỏ khỏi yêu thích."); }
    if (select) { if (!selections.includes(select.dataset.select)) selections.push(select.dataset.select); saveState(); renderBeats(); openDrawer(); }
    if (remove) { selections = selections.filter(id => id !== remove.dataset.remove); saveState(); renderBeats(); renderDrawer(); }
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape") { closeDrawer(); toggleMenu(true); } });
  $$(".faq-list details").forEach(detail => detail.addEventListener("toggle", () => { if (detail.open) $$(".faq-list details").filter(other => other !== detail).forEach(other => { other.open = false; }); }));
  audio.addEventListener("play", () => { const button = $(`[data-play="${CSS.escape(activeBeatId)}"]`); if (button) button.textContent = "Ⅱ"; });
  audio.addEventListener("pause", () => { const button = $(`[data-play="${CSS.escape(activeBeatId)}"]`); if (button) button.textContent = "▶"; });
  audio.addEventListener("error", () => showToast("File nghe thử không tải được."));
  saveState();
})();
