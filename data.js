/**
 * Dữ liệu mặc định của KDASUN Music.
 * Thêm beat mới bằng cách sao chép một object và đổi `id` thành giá trị duy nhất.
 * `coverUrl` trỏ tới ảnh trong assets/images và `previewUrl` trỏ tới audio nghe thử trong assets/audio.
 * Để trống nếu chưa có file. Không đưa beat WAV/stems đầy đủ vào repository công khai.
 */
window.KDASUN_BEATS = Object.freeze([
  { id: "bm", title: "Bình Minh Tây Bắc", genre: "Folk / Thái", mood: "Tươi sáng", bpm: 92, key: "Em", price: 499000, theme: "", description: "Không gian folk hiện đại, giàu hình ảnh thiên nhiên.", coverUrl: "", previewUrl: "" },
  { id: "mb", title: "Mùa Ban Nở", genre: "Pop / Thái", mood: "Lãng mạn", bpm: 96, key: "C", price: 399000, theme: "t2", description: "Pop nhẹ với giai điệu gần gũi và giàu cảm xúc.", coverUrl: "", previewUrl: "" },
  { id: "nm", title: "Nhà Mới", genre: "Pop / Lào", mood: "Vui tươi", bpm: 100, key: "G", price: 399000, theme: "t3", description: "Nhịp pop sáng, phù hợp nội dung lễ hội và gia đình.", coverUrl: "", previewUrl: "" },
  { id: "nt", title: "Nắm Tay Em", genre: "Ballad / Thái", mood: "Sâu lắng", bpm: 78, key: "D", price: 499000, theme: "t2", description: "Ballad dành nhiều không gian cho vocal và lời ca.", coverUrl: "", previewUrl: "" },
  { id: "ds", title: "Dòng Suối Mơ", genre: "Lo-fi / Chill", mood: "Thư giãn", bpm: 72, key: "Am", price: 299000, theme: "t3", description: "Lo-fi nhẹ nhàng dành cho nội dung kể chuyện.", coverUrl: "", previewUrl: "" }
]);
