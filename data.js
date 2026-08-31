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
window.KDASUN_PROJECTS = Object.freeze([
  {id:"rqpb4xq3zRc",title:"Bó Lụ Pền Luông Côn",subtitle:"Dạy bảo con nên người",category:"Nhạc Thái Tây Bắc",image:"assets/images/projects/bo-lu-pen-luong-con.webp"},
  {id:"tulb5SX0-64",title:"Cóm Lụ Non",subtitle:"Lò Văn Lâm × KDASUN",category:"Dân ca Thái · Remix",image:"assets/images/projects/com-lu-non.webp"},
  {id:"3QYPyDH9_A0",title:"Tay Nặm Ma",subtitle:"Sáng tác Lò Văn Lâm × KDASUN",category:"Nhạc Thái Sông Mã",image:"assets/images/projects/tay-nam-ma.webp"},
  {id:"veYPZGtPVfc",title:"Nha Lưm Cồng Êm Cồng Ải",subtitle:"Đừng quên công ơn bố mẹ",category:"Ca khúc gia đình",image:"assets/images/projects/nha-lum-cong-on.webp"},
  {id:"Rhj9XzgIsso",title:"Mẹ Con Mất Rồi",subtitle:"Êm Lụ Tài Sìa Lẹo",category:"Khắp Quam Tay",image:"assets/images/projects/me-con-mat-roi.webp"},
  {id:"_oyLSXZluLw",title:"Êm Bó Lụ Dệt Pặư",subtitle:"Mẹ dặn con làm dâu",category:"Khắp Thái Tây Bắc",image:"assets/images/projects/em-bo-lu-det-pau.webp"}
]);

window.KDASUN_BEATS = Object.freeze([
  {id:"bm",title:"Bình Minh Tây Bắc",producer:"Lò Văn Lâm",genre:"Folk / Thái",mood:"Tươi sáng",bpm:92,key:"Em",price:499000,theme:"",description:"Folk hiện đại, giàu không gian núi rừng và phù hợp vocal kể chuyện.",coverUrl:"",previewUrl:"",featured:true,exclusive:true},
  {id:"mb",title:"Mùa Ban Nở",producer:"Lò Văn Lâm",genre:"Pop / Thái",mood:"Lãng mạn",bpm:96,key:"C",price:399000,theme:"t2",description:"Pop nhẹ với giai điệu gần gũi, giàu cảm xúc và dễ phát triển lời ca.",coverUrl:"",previewUrl:"",featured:false,exclusive:true},
  {id:"nt",title:"Nắm Tay Em",producer:"Lò Văn Lâm",genre:"Ballad / Thái",mood:"Sâu lắng",bpm:78,key:"D",price:499000,theme:"t3",description:"Ballad dành nhiều không gian cho vocal, tự sự và cao trào cuối bài.",coverUrl:"",previewUrl:"",featured:false,exclusive:false},
  {id:"ds",title:"Dòng Suối Mơ",producer:"Lò Văn Lâm",genre:"Lo-fi / Chill",mood:"Thư giãn",bpm:72,key:"Am",price:299000,theme:"t2",description:"Chất lo-fi êm, phù hợp nội dung kể chuyện, phong cảnh và video ngắn.",coverUrl:"",previewUrl:"",featured:false,exclusive:true}
]);
