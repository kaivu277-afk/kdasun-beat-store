(() => {
  "use strict";
  const $ = selector => document.querySelector(selector);
  const defaults = Array.isArray(window.KDASUN_BEATS) ? window.KDASUN_BEATS : [];
  let beats = readBeats(), current = 0, toastTimer;

  function readBeats() {
    try {
      const saved = JSON.parse(localStorage.getItem("kd_admin"));
      return Array.isArray(saved) && saved.length ? saved.map(normalizeBeat) : defaults.map(normalizeBeat);
    } catch { return defaults.map(normalizeBeat); }
  }
  function normalizeBeat(beat, index) {
    return { id:String(beat.id || `beat-${Date.now()}-${index}`), title:String(beat.title || "Beat mới"), genre:String(beat.genre || "Folk / Thái"), mood:String(beat.mood || ""), bpm:Number(beat.bpm) || 90, key:String(beat.key || "C"), price:Math.max(0,Number(beat.price) || 0), theme:String(beat.theme || beat.t || ""), description:String(beat.description || beat.desc || ""), coverUrl:String(beat.coverUrl || ""), previewUrl:String(beat.previewUrl || "") };
  }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" })[char]); }
  function formatMoney(value) { return `${new Intl.NumberFormat("vi-VN").format(value)}đ`; }
  function renderList() {
    $("#list").innerHTML = beats.map((beat,index) => `<article class="row ${index===current ? "active" : ""}" data-index="${index}"><span class="thumb"></span><div><b>${escapeHtml(beat.title)}</b><small>${escapeHtml(beat.genre)} · ${beat.bpm} BPM · ${escapeHtml(beat.key)}</small><strong>${formatMoney(beat.price)}</strong></div><button type="button" aria-label="Chỉnh sửa ${escapeHtml(beat.title)}">✎</button></article>`).join("");
    $("#metricBeats").textContent = beats.length;
  }
  function load(index) {
    if (!beats[index]) return; current=index; const beat=beats[index];
    ["title","genre","bpm","key","price","mood","coverUrl","previewUrl"].forEach(key => { $(`#${key}`).value=beat[key] ?? ""; });
    $("#desc").value=beat.description || ""; renderList();
  }
  function saveCurrent() {
    if (!beats[current]) return;
    const title=$("#title").value.trim(), genre=$("#genre").value.trim();
    if (!title || !genre) return showToast("Vui lòng nhập tên beat và thể loại.");
    Object.assign(beats[current], { title, genre, bpm:Math.max(1,Number($("#bpm").value)||90), key:$("#key").value.trim()||"C", price:Math.max(0,Number($("#price").value)||0), mood:$("#mood").value.trim(), coverUrl:$("#coverUrl").value.trim(), previewUrl:$("#previewUrl").value.trim(), description:$("#desc").value.trim() });
    persist("Đã lưu thay đổi trên thiết bị này.");
  }
  function persist(message) {
    try { localStorage.setItem("kd_admin",JSON.stringify(beats)); renderList(); showToast(message); }
    catch { showToast("Không thể lưu dữ liệu trên trình duyệt này."); }
  }
  function showToast(message) { $("#toast").textContent=message; $("#toast").classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$("#toast").classList.remove("show"),2800); }
  $("#list").addEventListener("click",event => { const row=event.target.closest("[data-index]"); if(row) load(Number(row.dataset.index)); });
  $("#save").addEventListener("click",saveCurrent);
  $("#add").addEventListener("click",() => { beats.unshift(normalizeBeat({id:`beat-${Date.now()}`,title:"Beat mới",genre:"Folk / Thái",bpm:90,key:"C",price:399000},0)); load(0); persist("Đã tạo beat mới trên thiết bị này."); });
  $("#publish").addEventListener("click",() => persist("Dữ liệu đã được lưu cục bộ. Cần backend để xuất bản cho mọi người."));
  renderList(); if(beats.length) load(0);
})();
