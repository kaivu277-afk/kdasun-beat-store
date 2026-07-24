const beats=[
{id:1,title:"After Midnight",artist:"KDASUN",genre:"Dark R&B",bpm:96,key:"F#m",plays:4832,price:599000,cover:"AM",gradient:"linear-gradient(135deg,#171717,#7b2543,#ff6b35)"},
{id:2,title:"Múa Cùng Nhau",artist:"KDASUN",genre:"Lao Dance",bpm:140,key:"Am",plays:10284,price:699000,cover:"MX",gradient:"linear-gradient(135deg,#0b302b,#177d69,#d8ff3e)"},
{id:3,title:"Falling Slowly",artist:"KDASUN",genre:"Pop Ballad",bpm:78,key:"C",plays:7214,price:549000,cover:"FS",gradient:"linear-gradient(135deg,#18202d,#44516a,#d6c3ab)"},
{id:4,title:"No Signal",artist:"KDASUN",genre:"Trap Soul",bpm:132,key:"Cm",plays:3955,price:649000,cover:"NS",gradient:"linear-gradient(135deg,#121212,#4c2e67,#d83d86)"},
{id:5,title:"Đám Cưới Hôm Nay",artist:"KDASUN",genre:"Vinahouse",bpm:145,key:"Gm",plays:12670,price:799000,cover:"DC",gradient:"linear-gradient(135deg,#2d1211,#ff4e21,#ffc857)"},
{id:6,title:"Biển Và Em",artist:"KDASUN",genre:"C-Pop",bpm:84,key:"Eb",plays:6277,price:599000,cover:"BE",gradient:"linear-gradient(135deg,#071f30,#166b8b,#89e3d6)"},
{id:7,title:"Golden Hour",artist:"KDASUN",genre:"Pop Rock",bpm:108,key:"A",plays:4451,price:599000,cover:"GH",gradient:"linear-gradient(135deg,#2d1a07,#a46318,#f6d681)"},
{id:8,title:"Hoa Ban Gọi Em",artist:"KDASUN",genre:"Thai Folk Pop",bpm:118,key:"Bm",plays:9132,price:699000,cover:"HB",gradient:"linear-gradient(135deg,#3a0a21,#b72b68,#ffadc5)"},
{id:9,title:"Neon Rain",artist:"KDASUN",genre:"Wavephonk",bpm:128,key:"Dm",plays:2847,price:749000,cover:"NR",gradient:"linear-gradient(135deg,#17152a,#4f3a96,#00d3ff)"},
{id:10,title:"Mẹ Ơi",artist:"KDASUN",genre:"Ballad",bpm:72,key:"C",plays:8340,price:499000,cover:"MO",gradient:"linear-gradient(135deg,#5a3528,#d79a68,#f3d8b8)"}
];
const licenses=[
{name:"MP3 Lease",desc:"MP3 high quality · social media",mult:.5},
{name:"WAV Premium",desc:"WAV + MP3 · commercial release",mult:1},
{name:"Trackout Stems",desc:"Full stems · mix & arrangement",mult:2.2},
{name:"Exclusive Rights",desc:"Beat removed after purchase",mult:9}
];
let visible=7,genre="All",query="",current=0,isPlaying=false,timer=null,time=0;
let bag=JSON.parse(localStorage.getItem("kdasun_bag_redesign")||"[]");
const $=s=>document.querySelector(s),money=n=>new Intl.NumberFormat("vi-VN").format(Math.round(n))+"₫";
function buildWave(){
  $("#miniWave").innerHTML=Array.from({length:52},(_,i)=>`<i style="height:${8+(i*17)%27}px"></i>`).join("");
}
function genres(){return ["All",...new Set(beats.map(b=>b.genre))]}
function renderFilters(){
 $("#filterRow").innerHTML=genres().map(g=>`<button class="${g===genre?"active":""}" data-genre="${g}">${g}</button>`).join("");
 document.querySelectorAll("[data-genre]").forEach(b=>b.onclick=()=>{genre=b.dataset.genre;renderFilters();renderTracks()})
}
function filtered(){return beats.filter(b=>(genre==="All"||b.genre===genre)&&(`${b.title} ${b.genre} ${b.bpm} ${b.key}`).toLowerCase().includes(query.toLowerCase()))}
function renderTracks(){
 const list=filtered().slice(0,visible);
 $("#trackList").innerHTML=list.map((b,i)=>`<article class="track-row">
   <span class="track-no">${String(i+1).padStart(2,"0")}</span>
   <div class="track-cover" style="background:${b.gradient}">${b.cover}</div>
   <div class="track-name"><strong>${b.title}</strong><span>${b.artist}</span></div>
   <span class="track-genre">${b.genre}</span>
   <span class="track-spec">${b.bpm} BPM · ${b.key}</span>
   <span class="track-plays">${b.plays.toLocaleString("vi-VN")} plays</span>
   <button class="row-play" data-play="${b.id}">▶</button>
 </article>`).join("");
 document.querySelectorAll("[data-play]").forEach(btn=>btn.onclick=()=>playBeat(Number(btn.dataset.play)));
 $("#loadMore").style.display=filtered().length>visible?"block":"none";
}
function playBeat(id){
 current=beats.findIndex(b=>b.id===id);
 const b=beats[current];isPlaying=true;time=0;clearInterval(timer);
 $("#playerTitle").textContent=b.title;$("#playerMeta").textContent=`${b.genre} · ${b.bpm} BPM`;$("#playerCover").textContent=b.cover;$("#playerCover").style.background=b.gradient;$("#player").classList.add("show");$("#playerMain").textContent="❚❚";$("#timeLabel").textContent="00:00 / 00:30";$("#timelineFill").style.width="0%";
 timer=setInterval(()=>{time++;$("#timelineFill").style.width=(time/30*100)+"%";$("#timeLabel").textContent=`00:${String(time).padStart(2,"0")} / 00:30`;if(time>=30){clearInterval(timer);isPlaying=false;$("#playerMain").textContent="▶"}},1000)
}
function togglePlay(){if(!$("#player").classList.contains("show"))return playBeat(beats[0].id);isPlaying=!isPlaying;$("#playerMain").textContent=isPlaying?"❚❚":"▶";if(isPlaying){timer=setInterval(()=>{time++;$("#timelineFill").style.width=(time/30*100)+"%";$("#timeLabel").textContent=`00:${String(time).padStart(2,"0")} / 00:30`;if(time>=30){clearInterval(timer);isPlaying=false;$("#playerMain").textContent="▶"}},1000)}else clearInterval(timer)}
function openLicense(id){const b=beats.find(x=>x.id===id);$("#dialogCover").textContent=b.cover;$("#dialogCover").style.background=b.gradient;$("#dialogTitle").textContent=b.title;$("#licenseOptions").innerHTML=licenses.map((l,i)=>`<button class="license-option" data-license="${i}" data-beat="${id}"><span><strong>${l.name}</strong><small>${l.desc}</small></span><b>${money(b.price*l.mult)}</b></button>`).join("");document.querySelectorAll("[data-license]").forEach(btn=>btn.onclick=()=>addToBag(id,Number(btn.dataset.license)));$("#licenseDialog").showModal()}
function addToBag(id,lix){const b=beats.find(x=>x.id===id),l=licenses[lix];bag.push({id,lix,price:Math.round(b.price*l.mult)});localStorage.setItem("kdasun_bag_redesign",JSON.stringify(bag));renderBag();$("#licenseDialog").close();openBag()}
function renderBag(){
 $("#bagCount").textContent=bag.length;
 $("#bagItems").innerHTML=bag.length?bag.map((item,i)=>{const b=beats.find(x=>x.id===item.id),l=licenses[item.lix];return `<div class="bag-item"><div class="bag-item-cover" style="background:${b.gradient}">${b.cover}</div><div><strong>${b.title}</strong><small>${l.name} · ${money(item.price)}</small></div><button data-remove="${i}">×</button></div>`}).join(""):`<p style="color:#777;margin-top:30px">Your bag is empty.</p>`;
 $("#bagTotal").textContent=money(bag.reduce((s,i)=>s+i.price,0));
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{bag.splice(Number(b.dataset.remove),1);localStorage.setItem("kdasun_bag_redesign",JSON.stringify(bag));renderBag()})
}
function openBag(){$("#bagDrawer").classList.add("open");$("#backdrop").classList.add("show")}
function closeBag(){$("#bagDrawer").classList.remove("open");$("#backdrop").classList.remove("show")}
$("#searchInput").oninput=e=>{query=e.target.value;visible=7;renderTracks()};
$("#loadMore").onclick=()=>{visible+=5;renderTracks()};
$("#bagButton").onclick=openBag;$("#closeBag").onclick=closeBag;$("#backdrop").onclick=closeBag;
$("#featuredPlay").onclick=()=>playBeat(1);$("#heroPlay").onclick=()=>playBeat(1);$("#playerMain").onclick=togglePlay;
$("#prevButton").onclick=()=>playBeat(beats[(current-1+beats.length)%beats.length].id);
$("#nextButton").onclick=()=>playBeat(beats[(current+1)%beats.length].id);
$("#playerBuy").onclick=()=>openLicense(beats[current].id);
$("#closeDialog").onclick=()=>$("#licenseDialog").close();
$("#checkoutButton").onclick=()=>alert("Bước thanh toán QR sẽ được kết nối ở phiên bản tiếp theo.");
buildWave();renderFilters();renderTracks();renderBag();
