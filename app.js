(() => {
  "use strict";
  const $ = selector => document.querySelector(selector);
  const defaults = Array.isArray(window.KDASUN_BEATS) ? window.KDASUN_BEATS : [];
  const storedBeats = readJson("kd_admin", null);
  const beats = normalizeBeats(Array.isArray(storedBeats) && storedBeats.length ? storedBeats : defaults);
  const favoriteValues = readJson("kd_f", []);
  const cartValues = readJson("kd_c", []);
  const favorites = new Set(Array.isArray(favoriteValues) ? favoriteValues : []);
  const audio = new Audio();
  audio.preload = "metadata";
  let cart = Array.isArray(cartValues) ? cartValues.filter(id => beats.some(beat => beat.id === id)) : [];
  let currentBeat = null;
  let toastTimer;

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function normalizeBeats(list) {
    return list.map((beat, index) => ({
      id: String(beat.id || `beat-${index + 1}`), title: String(beat.title || "Beat chưa đặt tên"),
      genre: String(beat.genre || "Chưa phân loại"), mood: String(beat.mood || ""),
      bpm: Number(beat.bpm) || 0, key: String(beat.key || "—"), price: Math.max(0, Number(beat.price) || 0),
      theme: String(beat.theme || beat.t || ""), description: String(beat.description || beat.desc || ""),
      previewUrl: String(beat.previewUrl || "")
    }));
  }
  function save() {
    localStorage.setItem("kd_f", JSON.stringify([...favorites]));
    localStorage.setItem("kd_c", JSON.stringify(cart));
  }
  function formatMoney(value) { return value === 0 ? "Miễn phí" : `${new Intl.NumberFormat("vi-VN").format(value)}đ`; }
  function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" })[char]); }
  function filteredBeats() {
    const query = $("#search").value.trim().toLocaleLowerCase("vi"), genre = $("#genre").value;
    return beats.filter(beat => {
      const text = `${beat.title} ${beat.genre} ${beat.mood} ${beat.bpm} ${beat.key}`.toLocaleLowerCase("vi");
      return (!query || text.includes(query)) && (!genre || beat.genre === genre);
    });
  }
  function render() {
    const list = filteredBeats();
    $("#grid").innerHTML = list.length ? list.map(beat => `<article class="card"><div class="art ${escapeHtml(beat.theme)}"><button type="button" data-play="${escapeHtml(beat.id)}" aria-label="Nghe thử ${escapeHtml(beat.title)}">▶</button></div><div class="body"><div class="row"><h3>${escapeHtml(beat.title)}</h3><button type="button" class="heart ${favorites.has(beat.id) ? "on" : ""}" data-favorite="${escapeHtml(beat.id)}" aria-label="${favorites.has(beat.id) ? "Bỏ khỏi" : "Thêm vào"} yêu thích">${favorites.has(beat.id) ? "♥" : "♡"}</button></div><small class="meta">${escapeHtml(beat.genre)} · BPM ${beat.bpm || "—"} · KEY ${escapeHtml(beat.key)}${beat.mood ? ` · ${escapeHtml(beat.mood)}` : ""}</small><div class="bottom"><span class="price">${formatMoney(beat.price)}</span><button type="button" class="add" data-cart="${escapeHtml(beat.id)}">Thêm giỏ</button></div></div></article>`).join("") : `<div class="empty"><b>Không tìm thấy beat phù hợp.</b><small>Hãy thử từ khóa hoặc thể loại khác.</small></div>`;
    $("#resultNote").textContent = `${list.length} beat`;
    $("#favN").textContent = favorites.size; $("#cartN").textContent = cart.length; $("#beatTotal").textContent = beats.length;
  }
  function selectBeat(id) {
    const beat = beats.find(item => item.id === id); if (!beat) return;
    audio.pause();
    audio.removeAttribute("src");
    if (beat.previewUrl) audio.src = beat.previewUrl;
    currentBeat = beat; $("#player").hidden = false; $("#ptitle").textContent = beat.title;
    $("#pmeta").textContent = `${beat.genre} · ${beat.bpm || "—"} BPM · ${beat.key}`; $("#pp").textContent = "▶";
  }
  function playSelected() {
    if (!currentBeat) return;
    if (!currentBeat.previewUrl) return showToast("Beat này chưa có bản nghe thử.");
    if (audio.paused) audio.play().catch(() => showToast("Không thể phát file nghe thử. Hãy kiểm tra đường dẫn audio."));
    else audio.pause();
  }
  function openDrawer(type) {
    $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false"); $("#shade").hidden = false; document.body.classList.add("drawer-open");
    $("#dtitle").textContent = type === "favorites" ? "Beat yêu thích" : "Giỏ hàng";
    const list = type === "favorites" ? beats.filter(beat => favorites.has(beat.id)) : cart.map(id => beats.find(beat => beat.id === id)).filter(Boolean);
    $("#dbody").innerHTML = list.length ? list.map(beat => `<article class="item"><span class="cover"></span><div><b>${escapeHtml(beat.title)}</b><small>${escapeHtml(beat.genre)}</small><strong>${formatMoney(beat.price)}</strong></div>${type === "cart" ? `<button type="button" data-remove="${escapeHtml(beat.id)}" aria-label="Xóa ${escapeHtml(beat.title)} khỏi giỏ">×</button>` : ""}</article>`).join("") : "<p>Chưa có nội dung.</p>";
    $("#dclose").focus();
  }
  function closeDrawer() { $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden", "true"); $("#shade").hidden = true; document.body.classList.remove("drawer-open"); }
  function showToast(message) { $("#toast").textContent = message; $("#toast").classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2600); }

  [...new Set(beats.map(beat => beat.genre))].sort((a,b) => a.localeCompare(b,"vi")).forEach(genre => { const option=document.createElement("option"); option.value=genre; option.textContent=genre; $("#genre").append(option); });
  document.addEventListener("click", event => {
    const play=event.target.closest("[data-play]"), favorite=event.target.closest("[data-favorite]"), add=event.target.closest("[data-cart]"), remove=event.target.closest("[data-remove]");
    if (play) selectBeat(play.dataset.play);
    if (favorite) { favorites.has(favorite.dataset.favorite) ? favorites.delete(favorite.dataset.favorite) : favorites.add(favorite.dataset.favorite); save(); render(); }
    if (add) { if (!cart.includes(add.dataset.cart)) { cart.push(add.dataset.cart); save(); render(); showToast("Đã thêm beat vào giỏ hàng."); } else showToast("Beat này đã có trong giỏ hàng."); }
    if (remove) { cart=cart.filter(id => id !== remove.dataset.remove); save(); render(); openDrawer("cart"); }
  });
  $("#search").addEventListener("input", render); $("#genre").addEventListener("change", render);
  $("#pclose").addEventListener("click", () => { audio.pause(); $("#player").hidden=true; }); $("#pp").addEventListener("click", playSelected);
  $("#favOpen").addEventListener("click", () => openDrawer("favorites")); $("#mfav").addEventListener("click", () => openDrawer("favorites"));
  $("#cartOpen").addEventListener("click", () => openDrawer("cart")); $("#mcart").addEventListener("click", () => openDrawer("cart"));
  $("#dclose").addEventListener("click", closeDrawer); $("#shade").addEventListener("click", closeDrawer);
  document.addEventListener("keydown", event => { if (event.key === "Escape") { closeDrawer(); audio.pause(); $("#player").hidden=true; } });
  audio.addEventListener("play", () => { $("#pp").textContent="Ⅱ"; $("#pp").setAttribute("aria-label","Tạm dừng"); });
  audio.addEventListener("pause", () => { $("#pp").textContent="▶"; $("#pp").setAttribute("aria-label","Phát"); });
  audio.addEventListener("ended", () => { $("#pp").textContent="▶"; });
  audio.addEventListener("error", () => { if (currentBeat?.previewUrl) showToast("File nghe thử không tải được."); });
  save(); render();
})();
