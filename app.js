const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');
function resizeCanvas(){ confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight; }
resizeCanvas(); addEventListener('resize', resizeCanvas);

let pieces = [];
function spawnConfetti(count=160){
  for(let i=0;i<count;i++){
    pieces.push({
      x: Math.random()*confettiCanvas.width,
      y: -20 - Math.random()*40,
      r: 6 + Math.random()*10,
      color: ['#ff8a33','#ffd94a','#54e1c1','#42b4ff','#ff6fb1'][Math.floor(Math.random()*5)],
      rot: Math.random()*Math.PI*2,
      vel: 2+Math.random()*3,
      sway: Math.random()*1.5+0.5
    });
  }
}
function tick(){
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  pieces.forEach(p=>{
    p.y += p.vel;
    p.x += Math.sin(p.rot+=0.05)*p.sway;
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6);
    ctx.restore();
  });
  pieces = pieces.filter(p=>p.y < confettiCanvas.height+40);
  requestAnimationFrame(tick);
}
tick();

const confettiBtn = document.getElementById('confettiBtn');
if(confettiBtn){ confettiBtn.addEventListener('click', ()=>spawnConfetti(240)); }

// Lightbox for gallery
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');
const lbClose = document.getElementById('lbClose');

document.querySelectorAll('#gallery .card img').forEach(img=>{
  img.addEventListener('click', ()=>{
    lbImg.src = img.src;
    lbCap.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden','false');
  });
});

function closeLb(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden','true');
  lbImg.removeAttribute('src');
}
lb.addEventListener('click', e=>{ if(e.target===lb) closeLb(); });
if(lbClose) lbClose.addEventListener('click', closeLb);
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLb(); });

// Draggable stickers
document.querySelectorAll('.sticker').forEach(el=>{
  el.style.position = 'relative';
  let sx=0, sy=0, ox=0, oy=0, drag=false;
  el.addEventListener('pointerdown', e=>{
    drag=true; el.setPointerCapture(e.pointerId);
    sx=e.clientX; sy=e.clientY;
    ox=parseFloat(el.dataset.x||0); oy=parseFloat(el.dataset.y||0);
  });
  el.addEventListener('pointermove', e=>{
    if(!drag) return;
    const dx=e.clientX-sx, dy=e.clientY-sy;
    const nx=ox+dx, ny=oy+dy;
    el.style.transform = `translate(${nx}px, ${ny}px) rotate(${dx*0.05}deg)`;
    el.dataset.x=nx; el.dataset.y=ny;
  });
  el.addEventListener('pointerup', ()=>drag=false);
});

// Parallax clouds
const clouds = document.querySelectorAll('.cloud');
addEventListener('scroll', ()=>{
  const y = scrollY;
  clouds.forEach((c,i)=>{ c.style.transform = `translateY(${y*0.05*(i+1)}px)`; });
});

// Placeholder assets generator (SVG data URIs)
function makeSVG(width, height, bg, text){
  const svg = encodeURIComponent(
`<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
  <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
    <stop offset='0' stop-color='${bg}' />
    <stop offset='1' stop-color='#ffffff' stop-opacity='.2' />
  </linearGradient></defs>
  <rect width='100%' height='100%' fill='url(#g)' />
  <g font-family='Rubik, Arial' font-size='28' font-weight='800' fill='#000'>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'>${text}</text>
  </g>
</svg>`);
  return `data:image/svg+xml,${svg}`;
}

// Inject placeholders if assets missing
function setFallback(selector, label, color){
  document.querySelectorAll(selector).forEach((img, idx)=>{
    img.addEventListener('error', ()=>{
      img.src = makeSVG(600, 400, color, `${label} ${idx+1}`);
    }, {once:true});
  });
}
setFallback('img.logo', 'LOGO', '#ffd94a');
setFallback('#gallery .card img', 'NFT', '#6a63ff');
