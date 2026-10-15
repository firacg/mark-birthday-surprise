'use strict';
const video=document.getElementById('birthday-video'),cover=document.getElementById('gift-cover'),endCard=document.getElementById('end-card'),openButton=document.getElementById('open-gift'),soundButton=document.getElementById('sound'),replayButton=document.getElementById('replay'),status=document.getElementById('status');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const canvas=document.getElementById('celebration'),ctx=canvas.getContext('2d');
const palette=['#ff695d','#ffd14b','#60d1e5','#63d495','#df8cff','#fff7d7'];
let width=innerWidth,height=innerHeight,particles=[],frame=0,last=0,fireworkUntil=0,nextFirework=0,partyTimer=0,started=false,opening=false;
function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
resize();addEventListener('resize',resize);
function emit(x,y,count,kind='confetti',angle=-Math.PI/2,spread=Math.PI*1.4){const limit=reduced.matches?16:Math.min(count,width<600?95:150);for(let i=0;i<limit;i++){const a=angle+(Math.random()-.5)*spread,speed=kind==='spark'?1+Math.random()*3:3+Math.random()*8;particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:1,decay:kind==='spark'?.012+Math.random()*.009:.003+Math.random()*.004,color:palette[Math.floor(Math.random()*palette.length)],size:kind==='spark'?1+Math.random()*2:3+Math.random()*5,rotation:Math.random()*6.3,spin:(Math.random()-.5)*.22,kind});}if(particles.length>650)particles.splice(0,particles.length-650);run();}
function firework(x,y){emit(x,y,45,'spark',0,Math.PI*2);}
function run(){if(!frame){last=performance.now();frame=requestAnimationFrame(draw);}}
function draw(now){const dt=Math.min((now-last)/16.67,2);last=now;ctx.clearRect(0,0,width,height);if(now<fireworkUntil&&now>nextFirework&&!reduced.matches){firework(width*(Math.random()>.5?.88:.12),height*(.16+Math.random()*.3));nextFirework=now+650;}
particles=particles.filter(p=>p.life>0&&p.y<height+40);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.kind==='spark'?.018:.085)*dt;p.vx*=Math.pow(.992,dt);p.rotation+=p.spin*dt;p.life-=p.decay*dt;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,p.life*2));ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.fillStyle=p.color;if(p.kind==='spark'){ctx.shadowBlur=7;ctx.shadowColor=p.color;ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill();}else{const squash=Math.max(.2,Math.abs(Math.cos(p.rotation)));ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size*1.7*squash);}ctx.restore();}
if(particles.length||now<fireworkUntil)frame=requestAnimationFrame(draw);else{frame=0;ctx.clearRect(0,0,width,height);}}
function celebrate(big=true){const now=performance.now();if(now-partyTimer<650)return;partyTimer=now;emit(width*.1,height*.72,big?100:35,'confetti',-Math.PI/3,.8);emit(width*.9,height*.72,big?100:35,'confetti',-Math.PI*2/3,.8);if(!reduced.matches){fireworkUntil=now+(big?3000:1000);nextFirework=now+120;run();}}
function syncSound(){soundButton.setAttribute('aria-pressed',String(video.muted));soundButton.querySelector('.sound-label').textContent=video.muted?'Звук выкл.':'Звук вкл.';soundButton.setAttribute('aria-label',video.muted?'Включить звук':'Выключить звук');}
async function playGreeting({replay=false,automatic=false}={}){if(opening)return;opening=true;status.textContent='';if(replay){video.currentTime=0;endCard.hidden=true;}try{await video.play();if(!started||replay)celebrate(true);started=true;cover.classList.add('opened');cover.setAttribute('aria-hidden','true');cover.inert=true;video.controls=true;replayButton.disabled=false;document.body.classList.add('is-playing');if(!automatic&&document.activeElement===openButton)video.focus();}catch(error){if(!automatic){status.textContent=video.error?'Видео пока не загрузилось. Проверь соединение и попробуй ещё раз.':'Нажми ещё раз, чтобы запустить поздравление.';}if(!started){cover.classList.remove('opened');cover.removeAttribute('aria-hidden');cover.inert=false;}}finally{opening=false;}}
video.tabIndex=0;
openButton.addEventListener('click',()=>playGreeting());
replayButton.addEventListener('click',()=>playGreeting({replay:true}));
document.getElementById('replay-end').addEventListener('click',()=>playGreeting({replay:true}));
document.getElementById('party').addEventListener('click',()=>celebrate(true));
soundButton.addEventListener('click',()=>{video.muted=!video.muted;syncSound();});
video.addEventListener('volumechange',syncSound);
video.addEventListener('ended',()=>{endCard.hidden=false;document.body.classList.remove('is-playing');celebrate(true);});
video.addEventListener('error',()=>{status.textContent='Видео не загрузилось. Проверь соединение и попробуй обновить страницу.';});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frame){cancelAnimationFrame(frame);frame=0;}particles=[];fireworkUntil=0;ctx.clearRect(0,0,width,height);}});
syncSound();
document.getElementById('fullscreen').addEventListener('click',async()=>{const shell=document.getElementById('video-shell');try{if(document.fullscreenElement){await document.exitFullscreen();}else if(shell.requestFullscreen){await shell.requestFullscreen();}else if(video.webkitEnterFullscreen){video.webkitEnterFullscreen();}}catch{status.textContent='Используй кнопку полного экрана в самом видеоплеере.';}});
setTimeout(()=>{celebrate(false);playGreeting({automatic:true});},450);

