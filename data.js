/**
 * DỮ LIỆU WEBSITE KDASUN MUSIC
 *
 * Thêm beat: sao chép một object trong KDASUN_BEATS, đổi `id` thành giá trị
 * duy nhất, đặt ảnh vào assets/images và audio nghe thử vào assets/audio.
 * Không đưa file WAV/stems đầy đủ lên repository công khai.
 *
 * `previewUrl` phải là file audio thật. Để trống sẽ hiện “Chưa có bản nghe thử”,
 * website không mô phỏng thời gian phát bằng timer.
 */
/**
 * VIDEO ĐÃ PHÁT HÀNH
 * Thêm video mới ở đầu danh sách. `id` là phần sau `watch?v=` của YouTube;
 * ảnh WebP đặt trong assets/images/projects để trang tải nhanh và ổn định.
 */
window.KDASUN_PROJECTS = Object.freeze([
  {id:"glbuqx4bVfo",title:"Khun Lú – Náng Ủa",subtitle:"Lò Thị Ban × Lò Văn Lâm · 05/09/2026",category:"Thẳm Lú Ủa · Nhạc Thái Tây Bắc",image:"assets/images/projects/khun-lu-nang-ua.webp"},
  {id:"il-ms5dvNQo",title:"Nghĩa Mè Êm – Tấm Lòng Người Mẹ",subtitle:"Lò Cầm Piu × Lò Thị Ban × Lò Văn Lâm · 03/09/2026",category:"Ca khúc về mẹ",image:"assets/images/projects/nghia-me-em.webp"},
  {id:"KGH_mxkoHRo",title:"Tây Bắc Chào Đón",subtitle:"Hoàng Ngọc Chấn × Lò Văn Lâm · 02/09/2026",category:"Nhạc Tây Bắc",image:"assets/images/projects/tay-bac-chao-don.webp"},
  {id:"9sfOvDB6X70",title:"Koam Bó Sơn Pú Hô Yaang Sieng",subtitle:"Lời dạy của Cụ Hồ vẫn còn vang vọng · 31/08/2026",category:"Âm nhạc Thái",image:"assets/images/projects/koam-bo-son-pu-ho.webp"},
  {id:"_oyLSXZluLw",title:"Êm Bó Lụ Dệt Pặư",subtitle:"Lò Cầm Piu × Lò Văn Lâm · 28/08/2026",category:"Mẹ dặn con làm dâu",image:"assets/images/projects/em-bo-lu-det-pau.webp"},
  {id:"eQvOVcE9icM",title:"Lụ Chằư Chàn",subtitle:"Lò Cầm Piu × Lò Văn Lâm · 21/08/2026",category:"AI Cover · Nhạc Thái Tây Bắc",image:"assets/images/projects/lu-chau-chan.webp"}
]);

window.KDASUN_BEATS = Object.freeze([
  {id:"bm",title:"Bình Minh Tây Bắc",producer:"Lò Văn Lâm",genre:"Folk / Thái",mood:"Tươi sáng",bpm:92,key:"Em",price:499000,theme:"",description:"Folk hiện đại, giàu không gian núi rừng và phù hợp vocal kể chuyện.",coverUrl:"",previewUrl:"",featured:true,exclusive:true},
  {id:"mb",title:"Mùa Ban Nở",producer:"Lò Văn Lâm",genre:"Pop / Thái",mood:"Lãng mạn",bpm:96,key:"C",price:399000,theme:"t2",description:"Pop nhẹ với giai điệu gần gũi, giàu cảm xúc và dễ phát triển lời ca.",coverUrl:"",previewUrl:"",featured:false,exclusive:true},
  {id:"nt",title:"Nắm Tay Em",producer:"Lò Văn Lâm",genre:"Ballad / Thái",mood:"Sâu lắng",bpm:78,key:"D",price:499000,theme:"t3",description:"Ballad dành nhiều không gian cho vocal, tự sự và cao trào cuối bài.",coverUrl:"",previewUrl:"",featured:false,exclusive:false},
  {id:"ds",title:"Dòng Suối Mơ",producer:"Lò Văn Lâm",genre:"Lo-fi / Chill",mood:"Thư giãn",bpm:72,key:"Am",price:299000,theme:"t2",description:"Chất lo-fi êm, phù hợp nội dung kể chuyện, phong cảnh và video ngắn.",coverUrl:"",previewUrl:"",featured:false,exclusive:true}
]);
