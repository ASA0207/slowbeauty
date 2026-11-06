(()=>{
'use strict';
const $ = q => document.querySelector(q);
const body=document.body, enter=$('#enter'), header=$('#header'), float=$('.floating-contact'), progress=$('#progress');
const menu=$('#mobileMenu'), menuBtn=$('#menuToggle'), easter=$('#easter'), lightbox=$('#lightbox');
const audio=$('#bgMusic'), dock=$('#audioDock'), musicBtn=$('#musicToggle'), musicText=$('#musicToggleText');
const volume=$('#musicVolume'), volumeOut=$('#volumeNumber'), audioNote=$('#entryAudioNote');
const START_VOLUME=.18;let isPlaying=false, fadeId=0, priorFocus=null, buffer='';
audio.volume=0;
function setPlaying(state){isPlaying=state;body.classList.toggle('music-on',state);musicText.textContent=state?'MUSIC ON':'MUSIC OFF';musicBtn.setAttribute('aria-label',state?'배경음악 끄기':'배경음악 켜기');}
function fadeTo(target,ms=700,onEnd){const token=++fadeId;const start=audio.volume,started=performance.now();function step(now){if(token!==fadeId)return;const k=Math.min(1,(now-started)/ms);audio.volume=Math.min(1,Math.max(0,start+(target-start)*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(step);else if(onEnd)onEnd();}requestAnimationFrame(step);}
function releaseBody(){if(!menu.classList.contains('active')&&!lightbox.classList.contains('active')&&!easter.classList.contains('active'))body.classList.remove('locked');}
function closeEnter(){if(enter.classList.contains('dismissed')||enter.classList.contains('is-entering'))return;enter.classList.add('is-entering');dock.hidden=false;setTimeout(()=>{enter.classList.add('dismissed');enter.setAttribute('aria-hidden','true');releaseBody();$('#scrollHint').classList.add('show');setTimeout(()=>$('#scrollHint').classList.remove('show'),3500);},630);}
async function playMusic(entrance=false){try{audio.load && audio.readyState===0 && audio.load();await audio.play();setPlaying(true);fadeTo(Number(volume.value)/100,entrance?2200:850);if(entrance)closeEnter();}catch(err){setPlaying(false);if(entrance){audioNote.textContent='현재 브라우저에서는 음악을 재생할 수 없지만 사이트는 이용할 수 있어요.';closeEnter();}}}
$('#enterMusicBtn').addEventListener('click',()=>playMusic(true));
$('#enterBtn').addEventListener('click',()=>{++fadeId;audio.pause();audio.volume=0;setPlaying(false);closeEnter();});
musicBtn.addEventListener('click',()=>{if(isPlaying){fadeTo(0,380,()=>{audio.pause();setPlaying(false);});}else playMusic(false);});
volume.addEventListener('input',()=>{volumeOut.textContent=volume.value+'%';if(isPlaying)fadeTo(Number(volume.value)/100,120);});
audio.addEventListener('error',()=>{setPlaying(false);audioNote.textContent='음악을 불러올 수 없어요. 조용히 입장은 정상 이용할 수 있습니다.'});
function onScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?window.scrollY/max*100:0)+'%';header.classList.toggle('scrolled',window.scrollY>60);float.classList.toggle('visible',window.scrollY>440);}
addEventListener('scroll',onScroll,{passive:true});onScroll();
function setMenu(open){menu.classList.toggle('active',open);menu.setAttribute('aria-hidden',String(!open));menuBtn.classList.toggle('active',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');body.classList.toggle('locked',open);header.style.color=open?'#f5f0e8':'';if(open)menu.querySelector('a').focus();else releaseBody();}
menuBtn.addEventListener('click',()=>setMenu(!menu.classList.contains('active')));menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
const observer=('IntersectionObserver'in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:.09}):null;
document.querySelectorAll('.reveal').forEach(el=>observer?observer.observe(el):el.classList.add('in-view'));
document.querySelectorAll('.gallery-item').forEach(b=>b.addEventListener('click',()=>{priorFocus=b;$('#lightboxImg').src=b.dataset.image;$('#lightboxImg').alt=b.dataset.alt;$('#lightboxCaption').textContent=b.dataset.alt;lightbox.classList.add('active');lightbox.setAttribute('aria-hidden','false');body.classList.add('locked');$('#lightboxClose').focus();}));
function closeLightbox(){lightbox.classList.remove('active');lightbox.setAttribute('aria-hidden','true');releaseBody();priorFocus?.focus();}
$('#lightboxClose').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
$('#copyAddress')?.addEventListener('click',async()=>{const address='경기 안양시 만안구 안양로417번길 8 1층 103호';try{await navigator.clipboard.writeText(address);$('#copyNotice').textContent='주소가 복사되었습니다.';}catch(e){$('#copyNotice').textContent='주소: '+address;}setTimeout(()=>$('#copyNotice').textContent='',3200)});
const colors=['#ffe3ac','#fff','#ffc7d7','#ec8697','#eac7c7'];
function openEaster(){if(!enter.classList.contains('dismissed')){enter.classList.add('dismissed');enter.setAttribute('aria-hidden','true');dock.hidden=false;}if(menu.classList.contains('active'))setMenu(false);priorFocus=document.activeElement;const confetti=$('#confetti');confetti.replaceChildren();for(let i=0;i<110;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'%';p.style.setProperty('--dur',(3+Math.random()*5)+'s');p.style.setProperty('--delay',(-Math.random()*8)+'s');p.style.setProperty('--rot',Math.random()*360+'deg');p.style.setProperty('--c',colors[i%colors.length]);p.style.width=(4+Math.random()*9)+'px';confetti.appendChild(p)}easter.classList.add('active');easter.setAttribute('aria-hidden','false');body.classList.add('locked');if(isPlaying)fadeTo(.055,350);$('#easterClose').focus();}
function closeEaster(){easter.classList.remove('active');easter.setAttribute('aria-hidden','true');releaseBody();if(isPlaying)fadeTo(Number(volume.value)/100,800);priorFocus?.focus()}
$('#easterClose').addEventListener('click',closeEaster);
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(easter.classList.contains('active'))closeEaster();else if(lightbox.classList.contains('active'))closeLightbox();else if(menu.classList.contains('active'))setMenu(false);return;}if(e.ctrlKey||e.metaKey||e.altKey||e.target.matches('input,textarea,[contenteditable]'))return;if(e.key.length===1){buffer=(buffer+e.key.toLowerCase()).slice(-3);if(buffer==='asa'&&!easter.classList.contains('active')){buffer='';openEaster();}}});
})();