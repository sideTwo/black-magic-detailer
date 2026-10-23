(() => {
  'use strict';
  const story=document.querySelector('.story');
  const visuals=[...document.querySelectorAll('.visual')];
  const copies=[...document.querySelectorAll('[data-copy]')];
  const chapters=[...document.querySelectorAll('[data-chapter]')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=n=>Math.min(1,Math.max(0,n));
  const stops=[0,.19,.36,.69,.89];
  const videoEnd=.88;
  let queued=false, displayed=0, target=0, lastTick=0, ready=false, video;
  const progress=document.querySelector('.story-progress span');
  function readProgress(){
    return clamp(-story.getBoundingClientRect().top / Math.max(1,story.offsetHeight-document.querySelector('.stage').offsetHeight));
  }
  function seek(){
    if(!video||!ready||!Number.isFinite(video.duration))return;
    const time=clamp(displayed/videoEnd)*Math.max(0,video.duration-1/24);
    video._target=time;
    if(!video.seeking&&Math.abs(video.currentTime-time)>1/48)video.currentTime=time;
  }
  const src=window.BMD_MEDIA?.sequence;
  if(src&&!reduced.matches){
    video=document.createElement('video');
    video.className='sequence-video';video.muted=true;video.playsInline=true;video.preload='auto';
    video.setAttribute('aria-hidden','true');video.setAttribute('disablepictureinpicture','');
    video.addEventListener('loadeddata',()=>{ready=true;seek();video.classList.add('ready');schedule()});
    video.addEventListener('seeked',()=>{seek()});
    video.addEventListener('error',()=>{ready=false;video.remove();video=null;schedule()});
    video.src=src;document.querySelector('.visuals').append(video);
  }
  function render(now){
    queued=false;
    document.querySelector('.header').classList.toggle('scrolled',scrollY>40);
    if(reduced.matches)return;
    target=readProgress();
    const dt=Math.min(64,lastTick?now-lastTick:16);lastTick=now;
    displayed+=(target-displayed)*(1-Math.exp(-dt/85));
    if(Math.abs(target-displayed)<.0005)displayed=target;
    const active=stops.reduce((current,start,i)=>displayed>=start?i:current,0);
    const finishOpacity=clamp((displayed-.86)/.06);
    visuals.forEach((el,i)=>{
      el.style.opacity=i===4?String(finishOpacity):i===Math.min(active,3)?'1':'0';
      el.style.transform='none';
    });
    copies.forEach((el,i)=>{
      const start=stops[i],end=stops[i+1]??1.1;
      const opacity=i===active?Math.min(i===0?1:clamp((displayed-start)/.045),clamp((end-displayed)/.045)):0;
      el.style.opacity=opacity;el.style.transform=`translateY(${(1-opacity)*12}px)`;
      el.setAttribute('aria-hidden',i!==active);
    });
    chapters.forEach((el,i)=>{el.classList.toggle('active',i===active);el.setAttribute('aria-pressed',i===active)});
    document.getElementById('chapter-number').textContent=`0${active+1} / 0${stops.length}`;
    progress.style.transform=`scaleX(${displayed})`;
    seek();
    if(displayed!==target)schedule();
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(render)}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  reduced.addEventListener('change',()=>location.reload());
  chapters.forEach((button,i)=>button.addEventListener('click',()=>{
    const top=story.getBoundingClientRect().top+scrollY;
    const distance=story.offsetHeight-document.querySelector('.stage').offsetHeight;
    scrollTo({top:top+distance*(stops[i]+(i? .055:0)),behavior:reduced.matches?'instant':'smooth'});
  }));
  document.querySelector('.scroll-cue').addEventListener('click',e=>{
    if(reduced.matches)return;e.preventDefault();chapters[1].click();
  });
  displayed=readProgress();schedule();
  const dialog=document.getElementById('inquiry');
  const form=document.getElementById('inquiry-form');
  const result=document.getElementById('message-result');
  const status=document.getElementById('copy-status');
  let opener;
  document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{
    opener=button;form.hidden=false;result.hidden=true;status.textContent='';
    document.getElementById('service').value=button.dataset.service||'Ich wünsche mir eine Beratung';
    dialog.showModal();document.body.classList.add('modal-open');
  }));
  dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close()});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus()});
  form.addEventListener('submit',e=>{
    e.preventDefault();const data=new FormData(form);const car=String(data.get('car')).trim();
    if(!car){document.getElementById('car').setCustomValidity('Bitte gib dein Fahrzeug ein.');document.getElementById('car').reportValidity();return;}
    const wish=String(data.get('wish')).trim();
    document.getElementById('message').value=`Hi Tim! Ich interessiere mich für eine Aufbereitung bei Black Magic Detailer.\n\nMein Fahrzeug: ${car}\nInteresse: ${data.get('service')}${wish?'\nMein Wunsch: '+wish:''}\n\nKönnen wir die Möglichkeiten und einen Termin besprechen?`;
    form.hidden=true;result.hidden=false;document.getElementById('message').focus();
  });
  document.getElementById('car').addEventListener('input',e=>e.target.setCustomValidity(''));
  document.getElementById('copy-message').addEventListener('click',async()=>{
    const msg=document.getElementById('message');
    try{await navigator.clipboard.writeText(msg.value);status.textContent='Kopiert. Öffne Instagram und füge die Nachricht im Chat mit Tim ein.'}
    catch{msg.select();status.textContent='Bitte den markierten Text manuell kopieren.'}
  });
  document.getElementById('edit-message').addEventListener('click',()=>{result.hidden=true;form.hidden=false;document.getElementById('car').focus()});
})();

