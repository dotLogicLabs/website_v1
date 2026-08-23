// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Circuit dot-grid animation
function initCircuit(canvasId, density){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,dots,dpr;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    dpr = Math.min(window.devicePixelRatio||1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w*dpr; canvas.height = h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const cell = density;
    const cols = Math.ceil(w/cell)+1;
    const rows = Math.ceil(h/cell)+1;
    dots = [];
    for(let i=0;i<cols;i++){
      for(let j=0;j<rows;j++){
        if(Math.random() > 0.55) continue;
        dots.push({
          x: i*cell + (Math.random()-0.5)*cell*0.4,
          y: j*cell + (Math.random()-0.5)*cell*0.4,
          r: Math.random()*1.4+0.6,
          phase: Math.random()*Math.PI*2,
          speed: 0.4+Math.random()*0.6,
          color: Math.random() > 0.85 ? '#C97D4A' : (Math.random() > 0.7 ? '#5FBFB3' : '#EDEEE9')
        });
      }
    }
  }

  function connect(){
    const maxDist = density*1.6;
    for(let i=0;i<dots.length;i++){
      for(let j=i+1;j<dots.length;j++){
        const dx = dots[i].x-dots[j].x, dy = dots[i].y-dots[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < maxDist){
          const alpha = (1-dist/maxDist)*0.12;
          ctx.strokeStyle = `rgba(58,71,83,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
  }

  let t = 0;
  function draw(){
    ctx.clearRect(0,0,w,h);
    connect();
    dots.forEach(d=>{
      const pulse = 0.55 + Math.sin(t*0.01*d.speed + d.phase)*0.45;
      ctx.globalAlpha = 0.25 + pulse*0.55;
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    t++;
    if(!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', ()=>{ resize(); if(reduceMotion) draw(); });
}

document.querySelectorAll('canvas[data-circuit]').forEach(c=>{
  initCircuit(c.id, parseInt(c.dataset.circuit,10) || 50);
});
