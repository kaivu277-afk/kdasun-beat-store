/**
 * CÁCH THÊM BEAT:
 * 1. Sao chép một object bên dưới và đổi `id`, `slug` thành giá trị duy nhất.
 * 2. Đặt cover vào assets/images và audio preview vào assets/audio.
 * 3. Điền đường dẫn tương đối, ví dụ:
 *    cover: "assets/images/ten-beat.webp",
 *    previewUrl: "assets/audio/ten-beat.mp3"
 * 4. Nếu chưa có file thật, để chuỗi rỗng. Website sẽ không tạo file hoặc thời gian giả.
 * 5. Cập nhật giá riêng trong `licensePrices`. Giá 0 nghĩa là miễn phí.
 */
window.KDASUN_BEATS = Object.freeze([
  {
    id: "after-midnight", slug: "after-midnight", title: "After Midnight", producer: "KDASUN",
    cover: "", previewUrl: "", coverTheme: "linear-gradient(145deg,#171512,#5e4530 52%,#b88f4c)",
    genre: "R&B đương đại", mood: "Sâu lắng", bpm: 96, key: "F♯m", duration: 0,
    releaseDate: "2026-07-10", playCount: 4832, featured: true, isNew: true, popular: false,
    free: false, exclusiveAvailable: true, tags: ["dark r&b","đêm","melody","ca sĩ"],
    basePrice: 599000, shortDescription: "Không gian R&B tối, giàu khoảng thở cho vocal và câu hook cảm xúc.",
    licensePrices: { mp3: 299000, wav: 599000, stems: 1290000, exclusive: 7900000 }
  },
  {
    id: "mua-cung-nhau", slug: "mua-cung-nhau", title: "Múa Cùng Nhau", producer: "KDASUN",
    cover: "", previewUrl: "", coverTheme: "linear-gradient(145deg,#111b18,#315448 55%,#a88c52)",
    genre: "Lao Dance", mood: "Vui tươi", bpm: 140, key: "Am", duration: 0,
    releaseDate: "2026-06-28", playCount: 10284, featured: true, isNew: false, popular: true,
    free: false, exclusiveAvailable: true, tags: ["lao dance","lễ hội","sôi động","dance"],
    basePrice: 699000, shortDescription: "Nhịp Lao Dance hiện đại, phù hợp sân khấu, lễ hội và nội dung ngắn.",
    licensePrices: { mp3: 349000, wav: 699000, stems: 1490000, exclusive: 8900000 }
  },
  {
    id: "bien-va-em", slug: "bien-va-em", title: "Biển Và Em", producer: "KDASUN",
    cover: "", previewUrl: "", coverTheme: "linear-gradient(145deg,#10191c,#2d5961 55%,#c4aa75)",
    genre: "C-Pop", mood: "Lãng mạn", bpm: 84, key: "E♭", duration: 0,
    releaseDate: "2026-07-18", playCount: 6277, featured: true, isNew: true, popular: false,
    free: false, exclusiveAvailable: true, tags: ["biển","c-pop","tình yêu","ballad"],
    basePrice: 599000, shortDescription: "Melody trong trẻo và giàu hình ảnh, dành cho một câu chuyện tình nhẹ nhàng.",
    licensePrices: { mp3: 299000, wav: 599000, stems: 1290000, exclusive: 7900000 }
  },
  {
    id: "dam-cuoi-hom-nay", slug: "dam-cuoi-hom-nay", title: "Đám Cưới Hôm Nay", producer: "KDASUN",
    cover: "", previewUrl: "", coverTheme: "linear-gradient(145deg,#251a16,#714a30 55%,#d4b36f)",
    genre: "Vinahouse", mood: "Hân hoan", bpm: 145, key: "Gm", duration: 0,
    releaseDate: "2026-05-20", playCount: 12670, featured: false, isNew: false, popular: true,
    free: false, exclusiveAvailable: false, tags: ["đám cưới","vinahouse","remix","sân khấu"],
    basePrice: 799000, shortDescription: "Năng lượng lễ cưới và sân khấu, drop sáng và dễ tạo khoảnh khắc.",
    licensePrices: { mp3: 399000, wav: 799000, stems: 1690000, exclusive: null }
  },
  {
    id: "falling-slowly", slug: "falling-slowly", title: "Falling Slowly", producer: "KDASUN",
    cover: "", previewUrl: "", coverTheme: "linear-gradient(145deg,#17191c,#4e5358 55%,#c4b69f)",
    genre: "Pop Ballad", mood: "Tự sự", bpm: 78, key: "C", duration: 0,
    releaseDate: "2026-07-05", playCount: 7214, featured: false, isNew: true, popular: true,
    free: false, exclusiveAvailable: true, tags: ["piano","ballad","tự sự","vocal"],
    basePrice: 549000, shortDescription: "Ballad tối giản với piano và dải động rộng để tôn màu giọng.",
    licensePrices: { mp3: 279000, wav: 549000, stems: 1190000, exclusive: 6900000 }
  },
  {
    id: "hoa-ban-goi-em", slug: "hoa-ban-goi-em", title: "Hoa Ban Gọi Em", producer: "KDASUN",
    cover: "", previewUrl: "", coverTheme: "linear-gradient(145deg,#251820,#6d3c51 55%,#c49a72)",
    genre: "Thai Folk Pop", mood: "Bay bổng", bpm: 118, key: "Bm", duration: 0,
    releaseDate: "2026-04-16", playCount: 9132, featured: false, isNew: false, popular: true,
    free: false, exclusiveAvailable: true, tags: ["thai pop","folk","hoa ban","melody"],
    basePrice: 699000, shortDescription: "Chất liệu folk Đông Nam Á hòa cùng cấu trúc pop hiện đại, dễ hát.",
    licensePrices: { mp3: 349000, wav: 699000, stems: 1490000, exclusive: 8500000 }
  },
  {
    id: "no-signal", slug: "no-signal", title: "No Signal", producer: "KDASUN",
    cover: "", previewUrl: "", coverTheme: "linear-gradient(145deg,#111112,#38323d 55%,#8b6b55)",
    genre: "Trap Soul", mood: "Lạnh", bpm: 132, key: "Cm", duration: 0,
    releaseDate: "2026-03-30", playCount: 3955, featured: false, isNew: false, popular: false,
    free: false, exclusiveAvailable: true, tags: ["trap soul","urban","lạnh","rap"],
    basePrice: 649000, shortDescription: "Trap Soul tối giản, bass sâu và khoảng trống phù hợp rap melody.",
    licensePrices: { mp3: 329000, wav: 649000, stems: 1390000, exclusive: 8200000 }
  },
  {
    id: "me-oi", slug: "me-oi", title: "Mẹ Ơi", producer: "KDASUN",
    cover: "", previewUrl: "", coverTheme: "linear-gradient(145deg,#211a17,#694f40 55%,#bda484)",
    genre: "Ballad", mood: "Xúc động", bpm: 72, key: "C", duration: 0,
    releaseDate: "2026-02-18", playCount: 8340, featured: false, isNew: false, popular: true,
    free: false, exclusiveAvailable: true, tags: ["gia đình","mẹ","ballad","piano"],
    basePrice: 499000, shortDescription: "Bản ballad ấm, chân thành, ưu tiên lời ca và cao trào cảm xúc.",
    licensePrices: { mp3: 249000, wav: 499000, stems: 1090000, exclusive: 6500000 }
  },
  {
    id: "first-light", slug: "first-light", title: "First Light", producer: "KDASUN",
    cover: "", previewUrl: "", coverTheme: "linear-gradient(145deg,#1c1b16,#5f5a3f 55%,#c2ad78)",
    genre: "Lo-fi Pop", mood: "Thư giãn", bpm: 88, key: "D", duration: 0,
    releaseDate: "2026-07-21", playCount: 1890, featured: false, isNew: true, popular: false,
    free: true, exclusiveAvailable: false, tags: ["lofi","chill","vlog","sáng"],
    basePrice: 0, shortDescription: "Lo-fi pop nhẹ, phù hợp bản nháp, vlog và nội dung kể chuyện.",
    licensePrices: { mp3: 0, wav: 399000, stems: 890000, exclusive: null }
  }
]);
