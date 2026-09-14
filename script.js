document.addEventListener("DOMContentLoaded",()=>{
  const gate=document.getElementById("gate");
  const openButton=document.getElementById("open-invitation");
  const invitation=document.getElementById("invitation");
  const music=document.getElementById("wedding-music");
  const musicToggle=document.getElementById("music-toggle");
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const petals=document.getElementById("falling-petals");
  if(petals&&!reduced){
    for(let i=0;i<18;i+=1){
      const petal=document.createElement("span");
      petal.className="petal";
      petal.style.left=`${Math.random()*100}%`;
      petal.style.setProperty("--fall-time",`${7+Math.random()*7}s`);
      petal.style.setProperty("--fall-delay",`${-Math.random()*14}s`);
      petal.style.transform=`scale(${.55+Math.random()*.8}) rotate(${Math.random()*180}deg)`;
      petals.appendChild(petal);
    }
  }

  if(music){music.volume=.42;music.loop=true}
  const startMusic=async()=>{if(!music)return;try{if(music.currentTime<25)music.currentTime=25;await music.play();musicToggle?.classList.remove("paused")}catch(e){musicToggle?.classList.add("paused")}};
  openButton?.addEventListener("click",()=>{
    startMusic();
    gate?.classList.add("opened");
    invitation?.classList.add("visible");
    invitation?.setAttribute("aria-hidden","false");
    document.body.classList.remove("locked");
    setTimeout(()=>document.querySelector(".hero")?.scrollIntoView(),80);
  },{once:true});
  musicToggle?.addEventListener("click",async()=>{if(!music)return;if(music.paused){await startMusic()}else{music.pause();musicToggle.classList.add("paused")}});
  document.querySelectorAll("[data-scroll]").forEach(btn=>btn.addEventListener("click",()=>document.querySelector(btn.dataset.scroll)?.scrollIntoView({behavior:reduced?"auto":"smooth"})));

  const target=new Date("2027-04-09T19:00:00+08:00").getTime();
  const fields={days:document.getElementById("cd-days"),hours:document.getElementById("cd-hours"),mins:document.getElementById("cd-mins"),secs:document.getElementById("cd-secs")};
  const pad=(n,l=2)=>String(n).padStart(l,"0");
  const tick=()=>{const left=Math.max(0,target-Date.now());fields.days.textContent=pad(Math.floor(left/86400000),3);fields.hours.textContent=pad(Math.floor(left/3600000)%24);fields.mins.textContent=pad(Math.floor(left/60000)%60);fields.secs.textContent=pad(Math.floor(left/1000)%60)};
  tick();setInterval(tick,1000);

  const canvas=document.getElementById("scratch-canvas");
  const card=document.getElementById("scratch-card");
  if(canvas&&card){
    const ctx=canvas.getContext("2d",{willReadFrequently:true});let drawing=false;let strokes=0;
    const size=()=>{const r=card.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalCompositeOperation="source-over";const g=ctx.createLinearGradient(0,0,r.width,r.height);g.addColorStop(0,"#2b6d79");g.addColorStop(.5,"#58b9c8");g.addColorStop(1,"#258da4");ctx.fillStyle=g;ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle="rgba(255,255,255,.88)";ctx.textAlign="center";ctx.textBaseline="middle";ctx.font=`500 ${Math.max(13,r.width*.025)}px Montserrat`;ctx.fillText("A LITTLE SECRET AWAITS",r.width/2,r.height/2-12);ctx.font=`italic ${Math.max(20,r.width*.045)}px Cormorant Garamond`;ctx.fillText("scratch here",r.width/2,r.height/2+24)};
    size();
    const point=e=>{const r=canvas.getBoundingClientRect();const p=e.touches?.[0]||e;return{x:p.clientX-r.left,y:p.clientY-r.top}};
    const scratch=e=>{if(!drawing)return;e.preventDefault();const p=point(e);ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(p.x,p.y,28,0,Math.PI*2);ctx.fill();strokes++;card.classList.add("engaged");if(strokes>55)card.classList.add("done")};
    const begin=e=>{drawing=true;scratch(e)};const end=()=>{drawing=false};
    canvas.addEventListener("pointerdown",begin);canvas.addEventListener("pointermove",scratch);window.addEventListener("pointerup",end);canvas.addEventListener("pointercancel",end);
    window.addEventListener("resize",()=>{if(!card.classList.contains("done"))size()},{passive:true});
  }

  const items=document.querySelectorAll(".reveal");
  if(reduced)items.forEach(el=>el.classList.add("in-view"));else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("in-view");observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:"0px 0px -30px"});items.forEach(el=>observer.observe(el))}
});
