(() => {
  "use strict";

  const beats = Array.isArray(window.KDASUN_BEATS) ? [...window.KDASUN_BEATS] : [];
  const config = window.KDASUN_CONFIG || {};
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storageKeys = { cart: "kdasun_cart_v3", favorites: "kdasun_favorites_v3" };
  const licenseCatalog = [
    { id: "mp3", code: "01 · MP3", name: "MP3 Basic", description: "Dành cho demo và nội dung số cơ bản.", features: ["File MP3 chất lượng cao", "Phạm vi sử dụng theo giấy phép", "YouTube / mạng xã hội", "Credit producer: KDASUN", "Không bao gồm stems"] },
    { id: "wav", code: "02 · WAV", name: "WAV Premium", description: "Cho bản phát hành cần file chất lượng cao.", features: ["WAV + MP3", "Có thể kiếm tiền theo giấy phép", "Video âm nhạc và biểu diễn", "Credit producer: KDASUN", "Không bao gồm stems"], recommended: true },
    { id: "stems", code: "03 · STEMS", name: "Trackout Stems", description: "Dành cho studio cần mix và chỉnh phối sâu.", features: ["WAV + MP3 + bộ trackout", "Mix / master linh hoạt", "Video và biểu diễn thương mại", "Có bao gồm stems", "Credit producer: KDASUN"] },
    { id: "exclusive", code: "04 · EXCLUSIVE", name: "Độc quyền hoàn toàn", description: "Trao đổi riêng về phạm vi khai thác độc quyền.", features: ["File đầy đủ theo thỏa thuận", "Gỡ beat khỏi danh mục sau xác nhận", "Phạm vi sử dụng theo hợp đồng", "Bao gồm stems nếu xác nhận", "Điều khoản được lập riêng"] }
  ];
  const services = [
    ["♪", "Phối beat theo yêu cầu", "Sản xuất bản phối dựa trên chất giọng, demo và mục tiêu phát hành."],
    ["↻", "Phối lại bài hát", "Làm mới cấu trúc, nhịp điệu và không gian âm thanh của bản nhạc hiện có."],
    ["≋", "Mix và master", "Cân bằng vocal, nhạc cụ và hoàn thiện độ lớn phù hợp nền tảng phát hành."],
    ["●", "Thu vocal", "Tư vấn quy trình thu, comp vocal và chuẩn bị dữ liệu cho hậu kỳ."],
    ["Aa", "Viết lời & melody", "Phát triển lời ca, hook và giai điệu theo câu chuyện của nghệ sĩ."],
    ["VI", "Chuyển thể Việt · Lào · Thái", "Điều chỉnh âm tiết, nhịp và sắc thái để bản chuyển thể tự nhiên."],
    ["▱", "Visualizer & MV AI", "Xây dựng hình ảnh chuyển động đồng bộ với tinh thần bài hát."],
    ["◇", "Thumbnail & artwork", "Thiết kế hình đại diện nhất quán cho phát hành và truyền thông."],
    ["↗", "Marketing bài hát", "Lập định hướng nội dung và điểm chạm phù hợp với ngân sách dự án."]
  ];

  const savedCart = readStorage(storageKeys.cart, []);
  const savedFavorites = readStorage(storageKeys.favorites, []);
  let cart = Array.isArray(savedCart) ? savedCart : [];
  let favorites = new Set(Array.isArray(savedFavorites) ? savedFavorites : []);
  let currentBeatIndex = 0;
  let currentBeat = null;
  let favoriteOnly = false;
  let lastFocusedElement = null;
  let toastTimer = null;

  const audio = $("#audioElement");
  const state = {
    query: "", genre: "", mood: "", key: "", bpmMin: 60, bpmMax: 160,
    price: "", free: false, exclusive: false, isNew: false, featured: false, sort: "newest"
  };

  function readStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch (error) {
      console.warn(`Không thể đọc ${key}:`, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Không thể lưu ${key}:`, error);
      showToast("Trình duyệt không thể lưu thay đổi trên thiết bị này.");
    }
  }

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" })[char]);
  }

  function formatMoney(value) {
    if (value === 0) return "Miễn phí";
    if (value == null) return "Liên hệ";
    return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("vi-VN", { notation: value >= 10000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  }

  function findBeat(id) {
    return beats.find(beat => beat.id === id);
  }

  function getLicense(licenseId) {
    return licenseCatalog.find(license => license.id === licenseId);
  }

  function coverMarkup(beat, className = "") {
    const image = beat.cover
      ? `<img src="${escapeHtml(beat.cover)}" alt="Ảnh bìa beat ${escapeHtml(beat.title)}" loading="lazy" width="640" height="640">`
      : `<div class="cover-content"><small>KDASUN MUSIC</small><strong>${escapeHtml(beat.title)}</strong></div>`;
    return `<div class="beat-cover ${className}" style="--cover:${escapeHtml(beat.coverTheme)}">${image}</div>`;
  }

  function badgesMarkup(beat) {
    const badges = [];
    if (beat.isNew) badges.push("MỚI");
    if (beat.featured) badges.push("NỔI BẬT");
    if (beat.exclusiveAvailable) badges.push("ĐỘC QUYỀN");
    if (beat.free) badges.push("MIỄN PHÍ");
    return badges.length ? `<div class="badge-row">${badges.map(item => `<span class="badge">${item}</span>`).join("")}</div>` : "";
  }

  function beatCardMarkup(beat) {
    const isFavorite = favorites.has(beat.id);
    return `<article class="beat-card" data-beat-card="${escapeHtml(beat.id)}">
      <div class="beat-cover" style="--cover:${escapeHtml(beat.coverTheme)}">
        ${beat.cover ? `<img src="${escapeHtml(beat.cover)}" alt="Ảnh bìa beat ${escapeHtml(beat.title)}" loading="lazy" width="640" height="520">` : `<div class="cover-content"><small>${escapeHtml(beat.genre)}</small><strong>${escapeHtml(beat.title)}</strong></div>`}
        ${badgesMarkup(beat)}
        <div class="cover-actions"><button class="cover-play" type="button" data-play="${escapeHtml(beat.id)}" aria-label="Nghe thử ${escapeHtml(beat.title)}">▶</button></div>
      </div>
      <div class="beat-card-info">
        <div class="card-title-row">
          <button class="card-title" type="button" data-detail="${escapeHtml(beat.id)}">${escapeHtml(beat.title)}</button>
          <button class="favorite-toggle ${isFavorite ? "active" : ""}" type="button" data-favorite="${escapeHtml(beat.id)}" aria-label="${isFavorite ? "Bỏ khỏi" : "Thêm vào"} yêu thích" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
        </div>
        <span class="producer">${escapeHtml(beat.producer)}</span>
        <div class="card-specs"><span>${escapeHtml(beat.genre)}</span><span>${beat.bpm} BPM</span><span>${escapeHtml(beat.key)}</span><span>${escapeHtml(beat.mood)}</span><span>${formatNumber(beat.playCount)} lượt nghe</span></div>
        <div class="card-actions">
          <span class="price">GIÁ TỪ<strong>${formatMoney(beat.basePrice)}</strong></span>
          <div class="small-actions">
            <button type="button" data-detail="${escapeHtml(beat.id)}">Chi tiết</button>
            <button class="license-button" type="button" data-license-dialog="${escapeHtml(beat.id)}">Chọn giấy phép</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function renderHero() {
    const featured = beats.find(beat => beat.featured) || beats[0];
    if (!featured) return;
    $("#heroFeature").innerHTML = `<article class="feature-card">
      <div class="beat-cover" style="--cover:${escapeHtml(featured.coverTheme)}">
        ${featured.cover ? `<img src="${escapeHtml(featured.cover)}" alt="Ảnh bìa beat nổi bật ${escapeHtml(featured.title)}" width="640" height="640">` : `<div class="cover-content"><small>BEAT NỔI BẬT</small><strong>${escapeHtml(featured.title)}</strong></div>`}
      </div>
      <div class="feature-meta"><div><strong>${escapeHtml(featured.title)}</strong><small>${escapeHtml(featured.genre)} · ${featured.bpm} BPM · ${escapeHtml(featured.key)}</small></div><button class="cover-play" type="button" data-play="${escapeHtml(featured.id)}" aria-label="Nghe thử ${escapeHtml(featured.title)}">▶</button></div>
      <div class="waveform" aria-hidden="true">${waveBars(48)}</div>
    </article>`;
    $("#beatStat").textContent = `${beats.length}`;
    $("#playStat").textContent = formatNumber(beats.reduce((sum, beat) => sum + beat.playCount, 0));
  }

  function waveBars(count = 42) {
    return Array.from({ length: count }, (_, index) => `<i style="--bar:${10 + ((index * 19) % 40)}px"></i>`).join("");
  }

  function renderTicker() {
    const genres = [...new Set(beats.map(beat => beat.genre))];
    const row = genres.map(genre => `<span>${escapeHtml(genre)}</span><i>✦</i>`).join("");
    $("#genreTicker").innerHTML = row + row;
  }

  function renderCuratedSections() {
    renderBeatCollection("#featuredBeats", beats.filter(beat => beat.featured).slice(0, 3));
    renderBeatCollection("#newBeats", [...beats].filter(beat => beat.isNew).sort((a,b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 3));
    renderBeatCollection("#popularBeats", [...beats].sort((a,b) => b.playCount - a.playCount).slice(0, 3));
  }

  function renderBeatCollection(selector, collection) {
    const container = $(selector);
    if (container) container.innerHTML = collection.map(beatCardMarkup).join("");
  }

  function renderFilters() {
    fillSelect("#genreFilter", [...new Set(beats.map(beat => beat.genre))]);
    fillSelect("#moodFilter", [...new Set(beats.map(beat => beat.mood))]);
    fillSelect("#keyFilter", [...new Set(beats.map(beat => beat.key))]);
  }

  function fillSelect(selector, values) {
    const select = $(selector);
    values.sort((a,b) => a.localeCompare(b, "vi")).forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  }

  function normalizedSearchText(beat) {
    return [beat.title, beat.producer, beat.genre, beat.mood, beat.bpm, beat.key, ...(beat.tags || [])]
      .join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function filteredBeats() {
    const query = state.query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const result = beats.filter(beat => {
      const price = beat.basePrice;
      const priceMatch = !state.price
        || (state.price === "free" && beat.free)
        || (state.price === "under600" && price < 600000)
        || (state.price === "600to900" && price >= 600000 && price <= 900000)
        || (state.price === "over900" && price > 900000);
      return (!query || normalizedSearchText(beat).includes(query))
        && (!state.genre || beat.genre === state.genre)
        && (!state.mood || beat.mood === state.mood)
        && (!state.key || beat.key === state.key)
        && beat.bpm >= state.bpmMin && beat.bpm <= state.bpmMax
        && priceMatch
        && (!state.free || beat.free)
        && (!state.exclusive || beat.exclusiveAvailable)
        && (!state.isNew || beat.isNew)
        && (!state.featured || beat.featured)
        && (!favoriteOnly || favorites.has(beat.id));
    });
    const sorters = {
      newest: (a,b) => b.releaseDate.localeCompare(a.releaseDate),
      plays: (a,b) => b.playCount - a.playCount,
      priceAsc: (a,b) => a.basePrice - b.basePrice,
      priceDesc: (a,b) => b.basePrice - a.basePrice,
      bpmAsc: (a,b) => a.bpm - b.bpm,
      bpmDesc: (a,b) => b.bpm - a.bpm,
      title: (a,b) => a.title.localeCompare(b.title, "vi")
    };
    return result.sort(sorters[state.sort]);
  }

  function renderCatalog() {
    const result = filteredBeats();
    $("#catalogGrid").innerHTML = result.map(beatCardMarkup).join("");
    $("#resultCount").textContent = `${result.length} kết quả${favoriteOnly ? " yêu thích" : ""}`;
    $("#emptyState").hidden = result.length > 0;
    $("#catalogGrid").hidden = result.length === 0;
  }

  function clearFilters() {
    Object.assign(state, { query:"", genre:"", mood:"", key:"", bpmMin:60, bpmMax:160, price:"", free:false, exclusive:false, isNew:false, featured:false, sort:"newest" });
    favoriteOnly = false;
    $("#favoriteButton").classList.remove("active");
    $("#favoriteButton").setAttribute("aria-pressed", "false");
    $("#searchInput").value = "";
    $("#genreFilter").value = "";
    $("#moodFilter").value = "";
    $("#keyFilter").value = "";
    $("#bpmMin").value = "60";
    $("#bpmMax").value = "160";
    $("#bpmOutput").textContent = "60–160";
    $("#priceFilter").value = "";
    ["freeFilter","exclusiveFilter","newFilter","featuredFilter"].forEach(id => { $(`#${id}`).checked = false; });
    $("#sortSelect").value = "newest";
    renderCatalog();
  }

  function updateBpm() {
    let min = Number($("#bpmMin").value);
    let max = Number($("#bpmMax").value);
    if (min > max) [min, max] = [max, min];
    state.bpmMin = min;
    state.bpmMax = max;
    $("#bpmOutput").textContent = `${min}–${max}`;
    renderCatalog();
  }

  function renderPricing() {
    const minimumPrice = licenseId => {
      const available = beats.map(beat => beat.licensePrices[licenseId]).filter(value => value != null);
      return available.length ? Math.min(...available) : null;
    };
    $("#pricingGrid").innerHTML = licenseCatalog.map(license => `<article class="price-card ${license.recommended ? "recommended" : ""}">
      <span class="plan-code">${license.code}</span><h3>${license.name}</h3><span class="from-price">Giá từ<strong>${formatMoney(minimumPrice(license.id))}</strong></span>
      <p>${license.description}</p><ul>${license.features.map(feature => `<li>✓ ${feature}</li>`).join("")}</ul>
      <a class="button ${license.recommended ? "button-primary" : "button-secondary"}" href="#kho-beat">Chọn beat</a>
    </article>`).join("");
  }

  function renderServices() {
    $("#servicesGrid").innerHTML = services.map(([icon,title,description]) => `<article class="service-card">
      <span class="service-icon" aria-hidden="true">${icon}</span><h3>${title}</h3><p>${description}</p>
      <button class="text-button" type="button" data-open-consultation="${escapeHtml(title)}">Yêu cầu tư vấn <span aria-hidden="true">↗</span></button>
    </article>`).join("");
  }

  function updateContactLinks() {
    const contact = config.contact || {};
    setContactLink("#contactPhone", contact.phone, contact.phone ? `tel:${contact.phone}` : "", "Chưa cấu hình số liên hệ");
    setContactLink("#contactEmail", contact.email, contact.email ? `mailto:${contact.email}` : "", "Chưa cấu hình email");
    setContactLink("#footerEmail", contact.email || "Email chưa cấu hình", contact.email ? `mailto:${contact.email}` : "");
    setContactLink("#footerZalo", contact.zalo ? `Zalo: ${contact.zalo}` : "Zalo chưa cấu hình", contact.zalo ? `https://zalo.me/${contact.zalo}` : "");
    const social = config.social || {};
    $("#socialLinks").innerHTML = Object.entries({ youtube: "YouTube", facebook: "Facebook", tiktok: "TikTok" })
      .filter(([key]) => social[key])
      .map(([key,label]) => `<a href="${escapeHtml(social[key])}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`).join("")
      || `<span class="producer">Mạng xã hội chưa cấu hình</span>`;
    if (config.domain) {
      let canonical = $('link[rel="canonical"]');
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
      canonical.href = config.domain;
    }
  }

  function setContactLink(selector, text, href, fallback = text) {
    const element = $(selector);
    if (!element) return;
    element.textContent = text || fallback;
    if (href) {
      element.href = href;
      if (href.startsWith("http")) { element.target = "_blank"; element.rel = "noopener noreferrer"; }
    } else {
      element.removeAttribute("href");
    }
  }

  function startBeat(id) {
    const beat = findBeat(id);
    if (!beat) return;
    currentBeat = beat;
    currentBeatIndex = beats.findIndex(item => item.id === beat.id);
    updatePlayer();
    $("#audioPlayer").hidden = false;
    document.body.style.paddingBottom = "88px";
    if (!beat.previewUrl) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      $("#playPauseButton").textContent = "▶";
      $("#playPauseButton").setAttribute("aria-label", "Không có bản nghe thử");
      showToast(`“${beat.title}” chưa có bản nghe thử.`);
      return;
    }
    if (audio.dataset.beatId !== beat.id) {
      audio.pause();
      audio.src = beat.previewUrl;
      audio.dataset.beatId = beat.id;
      audio.load();
    }
    audio.play().catch(error => {
      console.warn("Không thể phát audio:", error);
      showToast("Không thể phát file nghe thử. Vui lòng kiểm tra lại file audio.");
    });
  }

  function updatePlayer() {
    if (!currentBeat) return;
    $("#playerTitle").textContent = currentBeat.title;
    $("#playerMeta").textContent = `${currentBeat.genre} · ${currentBeat.bpm} BPM · ${currentBeat.key}`;
    $("#playerCover").style.setProperty("--cover", currentBeat.coverTheme);
    $("#playerFavorite").classList.toggle("active", favorites.has(currentBeat.id));
    $("#playerFavorite").textContent = favorites.has(currentBeat.id) ? "♥" : "♡";
    $("#playerFavorite").setAttribute("aria-pressed", String(favorites.has(currentBeat.id)));
    $("#durationTime").textContent = currentBeat.previewUrl ? formatTime(audio.duration) : "Chưa có preview";
  }

  function toggleAudio() {
    if (!currentBeat) return startBeat(beats[0]?.id);
    if (!currentBeat.previewUrl) return showToast("Beat này chưa có bản nghe thử.");
    if (audio.paused) audio.play().catch(() => showToast("Không thể phát file nghe thử."));
    else audio.pause();
  }

  function changeBeat(offset) {
    if (!beats.length) return;
    const nextIndex = (currentBeatIndex + offset + beats.length) % beats.length;
    startBeat(beats[nextIndex].id);
  }

  function toggleFavorite(id) {
    if (!findBeat(id)) return;
    if (favorites.has(id)) favorites.delete(id); else favorites.add(id);
    writeStorage(storageKeys.favorites, [...favorites]);
    updateFavoriteCount();
    renderCuratedSections();
    renderCatalog();
    updatePlayer();
    if ($("#beatDialog").open) openBeatDetail(id, false);
  }

  function updateFavoriteCount() {
    $("#favoriteCount").textContent = favorites.size;
  }

  function openBeatDetail(id, updateHash = true) {
    const beat = findBeat(id);
    if (!beat) return;
    const similar = beats.filter(item => item.id !== beat.id && (item.genre === beat.genre || item.mood === beat.mood)).slice(0,3);
    $("#beatDialogContent").innerHTML = `<div class="beat-detail-hero">
      ${coverMarkup(beat, "detail-cover")}
      <div class="detail-copy">
        <p class="eyebrow">CHI TIẾT BEAT</p><h2 id="beatDialogTitle">${escapeHtml(beat.title)}</h2><span class="producer">Sản xuất bởi ${escapeHtml(beat.producer)}</span>
        <div class="detail-specs"><span>${escapeHtml(beat.genre)}</span><span>${beat.bpm} BPM</span><span>Tone ${escapeHtml(beat.key)}</span><span>${escapeHtml(beat.mood)}</span><span>${beat.duration ? formatTime(beat.duration) : "Chưa có thời lượng"}</span><span>${formatNumber(beat.playCount)} lượt nghe</span></div>
        <div class="detail-wave" aria-label="${beat.previewUrl ? "Dạng sóng âm thanh trang trí" : "Chưa có bản nghe thử"}">${waveBars(36)}</div>
        <p class="detail-description">${escapeHtml(beat.shortDescription)}</p>
        <div class="detail-specs">${beat.tags.map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="detail-actions">
          <button class="button button-primary" type="button" data-play="${escapeHtml(beat.id)}">${beat.previewUrl ? "Nghe thử" : "Chưa có bản nghe thử"}</button>
          <button class="button button-secondary" type="button" data-favorite="${escapeHtml(beat.id)}">${favorites.has(beat.id) ? "♥ Đã yêu thích" : "♡ Yêu thích"}</button>
          <button class="button button-secondary" type="button" data-license-dialog="${escapeHtml(beat.id)}">Chọn giấy phép</button>
          <button class="button button-secondary" type="button" data-share="${escapeHtml(beat.id)}">Chia sẻ</button>
        </div>
      </div>
    </div>
    <div class="similar-section"><h3>Beat tương tự</h3><div class="similar-list">${similar.length ? similar.map(item => `<button type="button" data-detail="${escapeHtml(item.id)}"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.genre)} · ${item.bpm} BPM</small></button>`).join("") : "<p>Chưa có beat tương tự.</p>"}</div></div>`;
    openDialog($("#beatDialog"));
    if (updateHash) history.replaceState(null, "", `#beat/${beat.slug}`);
  }

  function openLicenseDialog(id) {
    const beat = findBeat(id);
    if (!beat) return;
    $("#licenseDialogContent").innerHTML = `<div class="modal-heading"><p class="eyebrow">CHỌN GIẤY PHÉP</p><h2 id="licenseDialogTitle">${escapeHtml(beat.title)}</h2><p>Mỗi gói có giá riêng theo beat. Điều khoản chính thức được xác nhận khi mua.</p></div>
      <div class="license-list">${licenseCatalog.map(license => {
        const price = beat.licensePrices[license.id];
        const unavailable = price == null;
        return `<button class="license-choice" type="button" data-add-cart="${escapeHtml(beat.id)}" data-license="${license.id}" ${unavailable ? "disabled" : ""}>
          <span><strong>${license.name}</strong><small>${unavailable ? "Hiện không khả dụng cho beat này" : license.description}</small></span><strong>${formatMoney(price)}</strong>
        </button>`;
      }).join("")}</div>`;
    closeDialog($("#beatDialog"));
    openDialog($("#licenseDialog"));
  }

  function addToCart(beatId, licenseId) {
    const beat = findBeat(beatId);
    const license = getLicense(licenseId);
    if (!beat || !license || beat.licensePrices[licenseId] == null) return;
    const duplicate = cart.some(item => item.beatId === beatId && item.licenseId === licenseId);
    if (duplicate) {
      showToast("Beat và giấy phép này đã có trong giỏ hàng.");
      closeDialog($("#licenseDialog"));
      openCart();
      return;
    }
    cart.push({ beatId, licenseId });
    saveCart();
    closeDialog($("#licenseDialog"));
    openCart();
    showToast("Đã thêm vào giỏ hàng.");
  }

  function saveCart() {
    cart = cart.filter(item => findBeat(item.beatId) && getLicense(item.licenseId) && findBeat(item.beatId).licensePrices[item.licenseId] != null);
    writeStorage(storageKeys.cart, cart);
    renderCart();
  }

  function renderCart() {
    $("#cartCount").textContent = cart.length;
    const container = $("#cartItems");
    if (!cart.length) {
      container.innerHTML = `<div class="cart-empty"><span>♩</span><p>Giỏ hàng đang trống.<br>Chọn beat và giấy phép để bắt đầu.</p><a class="button button-secondary" href="#kho-beat" data-close-cart>Khám phá kho beat</a></div>`;
      $("#cartTotal").textContent = "0đ";
      $("#clearCart").hidden = true;
      $("#checkoutButton").disabled = true;
      return;
    }
    $("#clearCart").hidden = false;
    $("#checkoutButton").disabled = false;
    container.innerHTML = cart.map((item,index) => {
      const beat = findBeat(item.beatId);
      const license = getLicense(item.licenseId);
      return `<article class="cart-item">
        ${coverMarkup(beat)}
        <div class="cart-item-info"><strong>${escapeHtml(beat.title)}</strong><span class="producer">${escapeHtml(beat.producer)}</span>
          <label><span class="sr-only">Đổi giấy phép</span><select data-cart-license="${index}">${licenseCatalog.map(option => {
            const unavailable = beat.licensePrices[option.id] == null;
            return `<option value="${option.id}" ${option.id === license.id ? "selected" : ""} ${unavailable ? "disabled" : ""}>${option.name}</option>`;
          }).join("")}</select></label>
        </div>
        <div class="cart-item-price"><strong>${formatMoney(beat.licensePrices[license.id])}</strong><button type="button" data-remove-cart="${index}">Xóa</button></div>
      </article>`;
    }).join("");
    $("#cartTotal").textContent = formatMoney(cart.reduce((sum,item) => sum + findBeat(item.beatId).licensePrices[item.licenseId], 0));
  }

  function changeCartLicense(index, licenseId) {
    const item = cart[index];
    if (!item) return;
    const duplicate = cart.some((entry,entryIndex) => entryIndex !== index && entry.beatId === item.beatId && entry.licenseId === licenseId);
    if (duplicate) {
      showToast("Giấy phép này đã có trong giỏ hàng.");
      renderCart();
      return;
    }
    item.licenseId = licenseId;
    saveCart();
  }

  function openCart() {
    lastFocusedElement = document.activeElement;
    $("#cartDrawer").classList.add("open");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
    $("#pageBackdrop").hidden = false;
    document.body.classList.add("drawer-open");
    $("#closeCart").focus();
  }

  function closeCart() {
    $("#cartDrawer").classList.remove("open");
    $("#cartDrawer").setAttribute("aria-hidden", "true");
    $("#pageBackdrop").hidden = true;
    document.body.classList.remove("drawer-open");
    lastFocusedElement?.focus?.();
  }

  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    lastFocusedElement = document.activeElement;
    dialog.showModal();
  }

  function closeDialog(dialog) {
    if (!dialog?.open) return;
    dialog.close();
    if (dialog.id === "beatDialog" && location.hash.startsWith("#beat/")) history.replaceState(null, "", "#kho-beat");
    lastFocusedElement?.focus?.();
  }

  function openCheckout() {
    if (!cart.length) return showToast("Giỏ hàng đang trống.");
    closeCart();
    $("#checkoutForm").hidden = false;
    $("#orderResult").hidden = true;
    $("#checkoutForm").reset();
    clearFormErrors($("#checkoutForm"));
    openDialog($("#checkoutDialog"));
  }

  function validateCheckout(form) {
    clearFormErrors(form);
    const data = new FormData(form);
    let valid = true;
    if (!data.get("name").trim()) { setFieldError(form, "name", "Vui lòng nhập họ và tên."); valid = false; }
    const phone = data.get("phone").trim();
    const zalo = data.get("zalo").trim();
    const email = data.get("email").trim();
    if (!phone && !zalo && !email) { $("#checkoutFormError").textContent = "Vui lòng nhập ít nhất một phương thức liên hệ: điện thoại, Zalo hoặc email."; valid = false; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setFieldError(form, "email", "Email chưa đúng định dạng."); valid = false; }
    if (!data.get("terms")) { $("#checkoutFormError").textContent = "Bạn cần đồng ý để KDASUN liên hệ xác nhận đơn."; valid = false; }
    return { valid, data };
  }

  function clearFormErrors(form) {
    $$(".field-error", form).forEach(item => item.textContent = "");
    const formError = $(".form-error", form);
    if (formError) formError.textContent = "";
    $$("[aria-invalid]", form).forEach(item => item.removeAttribute("aria-invalid"));
  }

  function setFieldError(form, fieldName, message) {
    const field = form.elements[fieldName];
    field.setAttribute("aria-invalid", "true");
    field.closest(".field")?.querySelector(".field-error")?.replaceChildren(document.createTextNode(message));
  }

  function createOrderId() {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getDate()).padStart(2,"0")}`;
    const random = crypto.getRandomValues(new Uint16Array(1))[0].toString(36).toUpperCase().padStart(4,"0").slice(-4);
    return `KD-${date}-${random}`;
  }

  function buildOrderText(data, orderId) {
    const lines = [
      `ĐƠN ĐẶT MUA KDASUN MUSIC`,
      `Mã đơn: ${orderId}`,
      `Khách hàng: ${data.get("name")}`,
      `Nghệ danh: ${data.get("artist") || "Không cung cấp"}`,
      `Điện thoại: ${data.get("phone") || "Không cung cấp"}`,
      `Zalo: ${data.get("zalo") || "Không cung cấp"}`,
      `Email: ${data.get("email") || "Không cung cấp"}`,
      `Mục đích: ${data.get("purpose") || "Chưa xác định"}`,
      "",
      "SẢN PHẨM:"
    ];
    cart.forEach((item,index) => {
      const beat = findBeat(item.beatId);
      const license = getLicense(item.licenseId);
      lines.push(`${index+1}. ${beat.title} — ${license.name} — ${formatMoney(beat.licensePrices[item.licenseId])}`);
    });
    lines.push("", `Tạm tính: ${$("#cartTotal").textContent}`, `Ghi chú: ${data.get("note") || "Không có"}`, "", "Đơn này cần KDASUN xác nhận trước khi thanh toán.");
    return lines.join("\n");
  }

  function renderOrderResult(text, orderId) {
    const contact = config.contact || {};
    const payment = config.payment || {};
    const zaloHref = contact.zalo ? `https://zalo.me/${encodeURIComponent(contact.zalo)}` : "";
    const emailHref = contact.email ? `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(`Đơn ${orderId} - KDASUN Music`)}&body=${encodeURIComponent(text)}` : "";
    const hasPayment = payment.bankName && payment.accountNumber && payment.accountName;
    $("#checkoutForm").hidden = true;
    $("#orderResult").hidden = false;
    $("#orderResult").innerHTML = `<div class="result-box">
      <p class="eyebrow">ĐÃ TẠO NỘI DUNG — CHƯA THANH TOÁN</p><h3>Mã đơn ${escapeHtml(orderId)}</h3><pre>${escapeHtml(text)}</pre>
      <div class="result-actions"><button class="button button-primary" type="button" data-copy-text>Sao chép đơn hàng</button>
      ${zaloHref ? `<a class="button button-secondary" href="${zaloHref}" target="_blank" rel="noopener noreferrer">Mở Zalo</a>` : `<button class="button button-secondary" type="button" disabled>Zalo chưa cấu hình</button>`}
      ${emailHref ? `<a class="button button-secondary" href="${emailHref}">Gửi email</a>` : `<button class="button button-secondary" type="button" disabled>Email chưa cấu hình</button>`}</div>
      <div class="payment-panel"><strong>Phương thức thanh toán dự kiến</strong>
        <div class="payment-methods"><span>Chuyển khoản</span><span>VietQR</span><span>MoMo</span><span>ZaloPay</span><span>PayPal / Stripe — tương lai</span></div>
        <p>${hasPayment ? `${escapeHtml(payment.bankName)} · ${escapeHtml(payment.accountNumber)} · ${escapeHtml(payment.accountName)}` : "Liên hệ để nhận thông tin thanh toán."}</p>
      </div>
    </div>`;
    $("#orderResult").dataset.text = text;
  }

  function openConsultation(service) {
    const form = $("#consultationForm");
    form.reset();
    form.elements.service.value = service || "Tư vấn dự án âm nhạc";
    $("#consultationResult").hidden = true;
    form.hidden = false;
    clearFormErrors(form);
    $("#consultationTitle").textContent = service || "Bắt đầu một dự án";
    openDialog($("#consultationDialog"));
  }

  function submitConsultation(form) {
    clearFormErrors(form);
    const data = new FormData(form);
    let valid = true;
    if (!data.get("name").trim()) { setFieldError(form, "name", "Vui lòng nhập họ và tên."); valid = false; }
    if (!data.get("contact").trim()) { setFieldError(form, "contact", "Vui lòng nhập Zalo, điện thoại hoặc email."); valid = false; }
    if (!valid) return;
    const text = [`YÊU CẦU TƯ VẤN KDASUN MUSIC`, `Dịch vụ: ${data.get("service")}`, `Họ tên: ${data.get("name")}`, `Liên hệ: ${data.get("contact")}`, `Nội dung: ${data.get("brief") || "Chưa cung cấp"}`].join("\n");
    form.hidden = true;
    const result = $("#consultationResult");
    result.hidden = false;
    result.dataset.text = text;
    const contact = config.contact || {};
    result.innerHTML = `<div class="result-box"><h3>Nội dung yêu cầu</h3><pre>${escapeHtml(text)}</pre><div class="result-actions">
      <button class="button button-primary" type="button" data-copy-consultation>Sao chép nội dung</button>
      ${contact.zalo ? `<a class="button button-secondary" href="https://zalo.me/${escapeHtml(contact.zalo)}" target="_blank" rel="noopener noreferrer">Mở Zalo</a>` : `<button class="button button-secondary" disabled>Zalo chưa cấu hình</button>`}
      ${contact.email ? `<a class="button button-secondary" href="mailto:${escapeHtml(contact.email)}?subject=${encodeURIComponent("Yêu cầu tư vấn KDASUN Music")}&body=${encodeURIComponent(text)}">Gửi email</a>` : `<button class="button button-secondary" disabled>Email chưa cấu hình</button>`}
    </div></div>`;
  }

  function openLegal(type) {
    const terms = `<h2 id="legalTitle">Thông tin giấy phép</h2><p>Đây là phần mô tả quy trình, không thay thế hợp đồng hoặc giấy phép chính thức.</p><h3>Phạm vi xác nhận</h3><p>Quyền sử dụng, giới hạn phát hành, credit producer, quyền chỉnh sửa và điều kiện độc quyền sẽ được ghi trong giấy phép đi kèm đơn hàng.</p><h3>Trước khi thanh toán</h3><p>KDASUN sẽ xác nhận beat, gói giấy phép, giá và phương thức bàn giao. Website không tự đánh dấu thanh toán thành công.</p>`;
    const privacy = `<h2 id="legalTitle">Chính sách quyền riêng tư</h2><p>Website tĩnh này lưu giỏ hàng và beat yêu thích trên chính thiết bị của bạn bằng localStorage.</p><h3>Thông tin liên hệ</h3><p>Khi bạn gửi nội dung qua Zalo hoặc email, thông tin được chuyển bằng ứng dụng bạn chọn. Website hiện không có backend và không tự lưu biểu mẫu lên máy chủ.</p><h3>Kiểm soát dữ liệu</h3><p>Bạn có thể xóa dữ liệu website trong cài đặt trình duyệt hoặc theo hướng dẫn trong README.</p>`;
    $("#legalContent").innerHTML = type === "privacy" ? privacy : terms;
    openDialog($("#legalDialog"));
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Đã sao chép nội dung.");
    } catch {
      showToast("Không thể sao chép tự động. Hãy chọn và sao chép nội dung thủ công.");
    }
  }

  async function shareBeat(id) {
    const beat = findBeat(id);
    if (!beat) return;
    const url = `${location.origin}${location.pathname}#beat/${beat.slug}`;
    try {
      if (navigator.share) await navigator.share({ title: `${beat.title} — KDASUN Music`, text: beat.shortDescription, url });
      else await copyText(url);
    } catch (error) {
      if (error.name !== "AbortError") showToast("Không thể chia sẻ lúc này.");
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function handleHash() {
    if (!location.hash.startsWith("#beat/")) return;
    const slug = decodeURIComponent(location.hash.slice(6));
    const beat = beats.find(item => item.slug === slug);
    if (beat) openBeatDetail(beat.id, false);
  }

  function bindEvents() {
    window.addEventListener("scroll", () => $("#siteHeader").classList.toggle("scrolled", window.scrollY > 20), { passive: true });
    $("#menuButton").addEventListener("click", () => {
      const open = $("#menuButton").getAttribute("aria-expanded") !== "true";
      $("#menuButton").setAttribute("aria-expanded", String(open));
      $("#menuButton").setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
      $("#mobileMenu").hidden = !open;
      $("#siteHeader").classList.toggle("menu-open", open);
    });
    $$("#mobileMenu a").forEach(link => link.addEventListener("click", () => {
      $("#menuButton").setAttribute("aria-expanded", "false");
      $("#menuButton").setAttribute("aria-label", "Mở menu");
      $("#mobileMenu").hidden = true;
      $("#siteHeader").classList.remove("menu-open");
    }));

    $("#heroPlayButton").addEventListener("click", () => startBeat((beats.find(beat => beat.featured) || beats[0])?.id));
    $("#favoriteButton").addEventListener("click", () => {
      favoriteOnly = !favoriteOnly;
      $("#favoriteButton").classList.toggle("active", favoriteOnly);
      $("#favoriteButton").setAttribute("aria-pressed", String(favoriteOnly));
      renderCatalog();
      document.querySelector("#kho-beat").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    $("#cartButton").addEventListener("click", openCart);
    $("#closeCart").addEventListener("click", closeCart);
    $("#pageBackdrop").addEventListener("click", closeCart);
    $("#clearCart").addEventListener("click", () => openDialog($("#confirmDialog")));
    $("#cancelConfirm").addEventListener("click", () => closeDialog($("#confirmDialog")));
    $("#confirmClear").addEventListener("click", () => { cart = []; saveCart(); closeDialog($("#confirmDialog")); showToast("Đã xóa toàn bộ giỏ hàng."); });
    $("#checkoutButton").addEventListener("click", openCheckout);

    const filterEvents = [
      ["searchInput","input",event => state.query = event.target.value],
      ["genreFilter","change",event => state.genre = event.target.value],
      ["moodFilter","change",event => state.mood = event.target.value],
      ["keyFilter","change",event => state.key = event.target.value],
      ["priceFilter","change",event => state.price = event.target.value],
      ["freeFilter","change",event => state.free = event.target.checked],
      ["exclusiveFilter","change",event => state.exclusive = event.target.checked],
      ["newFilter","change",event => state.isNew = event.target.checked],
      ["featuredFilter","change",event => state.featured = event.target.checked],
      ["sortSelect","change",event => state.sort = event.target.value]
    ];
    filterEvents.forEach(([id,eventName,handler]) => $(`#${id}`).addEventListener(eventName, event => { handler(event); renderCatalog(); }));
    $("#bpmMin").addEventListener("input", updateBpm);
    $("#bpmMax").addEventListener("input", updateBpm);
    $("#clearFilters").addEventListener("click", clearFilters);
    $("#filterMobileButton").addEventListener("click", () => {
      const open = $("#filterPanel").classList.toggle("open");
      $("#filterMobileButton").setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", event => {
      const play = event.target.closest("[data-play]");
      const favorite = event.target.closest("[data-favorite]");
      const detail = event.target.closest("[data-detail]");
      const license = event.target.closest("[data-license-dialog]");
      const addCart = event.target.closest("[data-add-cart]");
      const removeCart = event.target.closest("[data-remove-cart]");
      const consultation = event.target.closest("[data-open-consultation]");
      const legal = event.target.closest("[data-open-legal]");
      const share = event.target.closest("[data-share]");
      if (play) startBeat(play.dataset.play);
      else if (favorite) toggleFavorite(favorite.dataset.favorite);
      else if (detail) openBeatDetail(detail.dataset.detail);
      else if (license) openLicenseDialog(license.dataset.licenseDialog);
      else if (addCart) addToCart(addCart.dataset.addCart, addCart.dataset.license);
      else if (removeCart) { cart.splice(Number(removeCart.dataset.removeCart), 1); saveCart(); showToast("Đã xóa sản phẩm."); }
      else if (consultation) openConsultation(consultation.dataset.openConsultation);
      else if (legal) openLegal(legal.dataset.openLegal);
      else if (share) shareBeat(share.dataset.share);
      else if (event.target.closest("[data-clear-filters]")) clearFilters();
      else if (event.target.closest("[data-close-cart]")) closeCart();
      else if (event.target.closest("[data-copy-text]")) copyText($("#orderResult").dataset.text);
      else if (event.target.closest("[data-copy-consultation]")) copyText($("#consultationResult").dataset.text);
      else if (event.target.closest("[data-close-dialog]")) closeDialog(event.target.closest("dialog"));
    });

    document.addEventListener("change", event => {
      const select = event.target.closest("[data-cart-license]");
      if (select) changeCartLicense(Number(select.dataset.cartLicense), select.value);
    });

    $$("dialog").forEach(dialog => {
      dialog.addEventListener("click", event => {
        const rectangle = dialog.getBoundingClientRect();
        const outside = event.clientX < rectangle.left || event.clientX > rectangle.right || event.clientY < rectangle.top || event.clientY > rectangle.bottom;
        if (outside) closeDialog(dialog);
      });
      dialog.addEventListener("close", () => {
        if (dialog.id === "beatDialog" && location.hash.startsWith("#beat/")) history.replaceState(null, "", "#kho-beat");
      });
    });

    $("#playPauseButton").addEventListener("click", toggleAudio);
    $("#previousButton").addEventListener("click", () => changeBeat(-1));
    $("#nextButton").addEventListener("click", () => changeBeat(1));
    $("#closePlayer").addEventListener("click", () => { audio.pause(); $("#audioPlayer").hidden = true; document.body.style.paddingBottom = ""; });
    $("#playerFavorite").addEventListener("click", () => currentBeat && toggleFavorite(currentBeat.id));
    $("#playerBuy").addEventListener("click", () => currentBeat && openLicenseDialog(currentBeat.id));
    $("#progressRange").addEventListener("input", event => {
      if (Number.isFinite(audio.duration)) audio.currentTime = (Number(event.target.value) / 100) * audio.duration;
    });
    $("#volumeRange").addEventListener("input", event => { audio.volume = Number(event.target.value); audio.muted = false; });
    $("#muteButton").addEventListener("click", () => { audio.muted = !audio.muted; $("#muteButton").textContent = audio.muted ? "○" : "◕"; });
    audio.addEventListener("play", () => { $("#playPauseButton").textContent = "Ⅱ"; $("#playPauseButton").setAttribute("aria-label", "Tạm dừng"); });
    audio.addEventListener("pause", () => { $("#playPauseButton").textContent = "▶"; $("#playPauseButton").setAttribute("aria-label", "Phát"); });
    audio.addEventListener("timeupdate", () => {
      $("#currentTime").textContent = formatTime(audio.currentTime);
      $("#durationTime").textContent = formatTime(audio.duration);
      $("#progressRange").value = Number.isFinite(audio.duration) && audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    });
    audio.addEventListener("ended", () => changeBeat(1));
    audio.addEventListener("error", () => currentBeat?.previewUrl && showToast("File nghe thử không tải được. Hãy kiểm tra đường dẫn audio."));

    $("#checkoutForm").addEventListener("submit", event => {
      event.preventDefault();
      const { valid, data } = validateCheckout(event.currentTarget);
      if (!valid) return;
      const orderId = createOrderId();
      const text = buildOrderText(data, orderId);
      renderOrderResult(text, orderId);
    });
    $("#consultationForm").addEventListener("submit", event => { event.preventDefault(); submitConsultation(event.currentTarget); });
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("keydown", event => {
      if (event.key === "Escape" && $("#cartDrawer").classList.contains("open")) closeCart();
      if (event.key === "Tab" && $("#cartDrawer").classList.contains("open")) {
        const focusable = $$('button:not([disabled]), a[href], select:not([disabled]), input:not([disabled])', $("#cartDrawer")).filter(element => element.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  function initialize() {
    if (!beats.length) {
      console.error("Không tìm thấy dữ liệu beat trong data/beats.js");
      $("#catalogGrid").innerHTML = `<div class="empty-state"><h3>Chưa có dữ liệu beat</h3><p>Kiểm tra file data/beats.js.</p></div>`;
      return;
    }
    audio.volume = .8;
    renderHero();
    renderTicker();
    renderCuratedSections();
    renderFilters();
    renderCatalog();
    renderPricing();
    renderServices();
    updateFavoriteCount();
    saveCart();
    updateContactLinks();
    $("#currentYear").textContent = new Date().getFullYear();
    bindEvents();
    handleHash();
  }

  initialize();
})();
