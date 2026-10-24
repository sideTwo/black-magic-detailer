(() => {
  'use strict';
  const story=document.querySelector('.story');
  const visuals=[...document.querySelectorAll('.visual')];
  const copies=[...document.querySelectorAll('[data-copy]')];
  const visualStage=document.querySelector('.visuals');
  const portrait=matchMedia('(max-width: 600px)');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=n=>Math.min(1,Math.max(0,n));
  const stops=[0,.185,.351,.672,.88];
  const videoEnd=.97;
  // Reserve the last part of the existing pinned distance for Tim's final shot.
  const journeyEnd=.78;
  let queued=false, displayed=0, target=0, lastTick=0, ready=false, video;
  let priming=false,primed=false;
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
  function primeVideo(){
    if(!video||priming||primed)return;
    const candidate=video;
    priming=true;
    // Safari may defer fetching/decoding until play is requested. This is
    // silent and inline, and is retried directly from a touch if necessary.
    const attempt=candidate.play();
    if(attempt?.then)attempt.then(()=>{
      candidate.pause();priming=false;
      if(candidate!==video)return;
      primed=true;seek();schedule();
    }).catch(()=>{priming=false});
    else{candidate.pause();priming=false}
  }
  if(src&&!reduced.matches){
    video=document.createElement('video');
    video.className='sequence-video';video.muted=true;video.defaultMuted=true;video.playsInline=true;video.preload='auto';
    video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
    video.setAttribute('aria-hidden','true');video.setAttribute('disablepictureinpicture','');
    video.addEventListener('loadeddata',()=>{ready=true;seek();video.classList.add('ready');schedule()});
    video.addEventListener('loadedmetadata',primeVideo);
    video.addEventListener('seeked',()=>{seek();schedule()});
    video.addEventListener('error',()=>{ready=false;video.remove();video=null;schedule()});
    video.src=src;document.querySelector('.visuals').append(video);video.load();
    story.addEventListener('pointerdown',primeVideo,{passive:true});
    story.addEventListener('touchend',primeVideo,{passive:true});
  }
  function render(now){
    queued=false;
    document.querySelector('.header').classList.toggle('scrolled',scrollY>40);
    if(reduced.matches)return;
    const scrollProgress=readProgress();
    target=clamp(scrollProgress/journeyEnd);
    const dt=Math.min(64,lastTick?now-lastTick:16);lastTick=now;
    // Ease wheel/touch impulses into one continuous camera movement.
    // Cap catch-up speed so a large wheel step cannot jump across a whole shot.
    const easedStep=(target-displayed)*(1-Math.exp(-dt/200));
    displayed+=Math.max(-dt/2200,Math.min(dt/2200,easedStep));
    // A fast fling may leave the pinned area before the decoder catches up.
    // Land on the matching final still while the scene is still pinned.
    const finalLanding=scrollProgress>=.94;
    if(finalLanding)displayed=1;
    if(Math.abs(target-displayed)<.0005)displayed=target;
    // Keep captions and the final still attached to the frame actually decoded.
    const frameProgress=finalLanding?videoEnd:ready&&video&&Number.isFinite(video.duration)
      ?video.currentTime/Math.max(1/24,video.duration-1/24)*videoEnd:displayed;
    const active=stops.reduce((current,start,i)=>frameProgress>=start?i:current,0);
    // Follow the subject in a portrait crop instead of shrinking the film
    // into a landscape strip. Interpolate to avoid reframing jumps.
    if(portrait.matches){
      const focus=[60,55,40,48,42];
      const next=Math.min(active+1,focus.length-1);
      const mix=clamp((frameProgress-stops[active])/((stops[next]??1)-stops[active]||1));
      const eased=mix*mix*(3-2*mix);
      visualStage.style.setProperty('--film-focus-x',`${focus[active]+(focus[next]-focus[active])*eased}%`);
    }
    const finishOpacity=frameProgress>=videoEnd-.002?clamp((displayed-.97)/.03):0;
    visuals.forEach((el,i)=>{
      el.style.opacity=i===4?String(finishOpacity):i===Math.min(active,3)?'1':'0';
      el.style.transform='none';
    });
    copies.forEach((el,i)=>{
      const start=stops[i],end=stops[i+1]??1.1;
      const opacity=i===active?Math.min(i===0?1:clamp((frameProgress-start)/.045),clamp((end-frameProgress)/.045)):0;
      el.style.opacity=opacity;el.style.transform=`translateY(${(1-opacity)*12}px)`;
      el.setAttribute('aria-hidden',i!==active);
    });
    progress.style.transform=`scaleX(${scrollProgress})`;
    seek();
    if(displayed!==target)schedule();
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(render)}}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  reduced.addEventListener('change',()=>location.reload());
  document.querySelector('.scroll-cue').addEventListener('click',e=>{
    if(reduced.matches)return;
    e.preventDefault();
    scrollBy({top:innerHeight*.35,behavior:'smooth'});
  });
  displayed=clamp(readProgress()/journeyEnd);schedule();
  // Reveal each section once; the page remains fully visible without JavaScript.
  if(!reduced.matches&&'IntersectionObserver' in window){
    document.documentElement.classList.add('js');
    const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');reveal.unobserve(entry.target)}
    }),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));
  }
  const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('site-nav');
  function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Menü öffnen');nav.classList.remove('open')}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');nav.classList.toggle('open',open)});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});

  const serviceTabs=[...document.querySelectorAll('[data-service-tab]')];
  function selectService(index,focus=false){
    serviceTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=i!==index});
    if(focus)serviceTabs[index].focus();
  }
  serviceTabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>selectService(i));
    tab.addEventListener('keydown',e=>{
      let next;
      if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%serviceTabs.length;
      if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i+serviceTabs.length-1)%serviceTabs.length;
      if(e.key==='Home')next=0;if(e.key==='End')next=serviceTabs.length-1;
      if(next!==undefined){e.preventDefault();selectService(next,true)}
    });
  });

  const compare=document.querySelector('.compare-range');
  function updateCompare(){
    const value=Number(compare.value);
    compare.parentElement.style.setProperty('--split',`${value}%`);
    compare.setAttribute('aria-valuetext',`${value} Prozent Vorher, ${100-value} Prozent Nachher`);
  }
  compare.addEventListener('input',updateCompare);
  function moveCompare(e){
    const rect=compare.getBoundingClientRect();
    compare.value=Math.round(Math.max(0,Math.min(100,(e.clientX-rect.left)/rect.width*100)));
    updateCompare();
  }
  compare.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    e.preventDefault();compare.focus({preventScroll:true});compare.setPointerCapture(e.pointerId);moveCompare(e);
  });
  compare.addEventListener('pointermove',e=>{if(compare.hasPointerCapture(e.pointerId))moveCompare(e)});
  compare.addEventListener('pointerup',e=>{if(compare.hasPointerCapture(e.pointerId)){moveCompare(e);compare.releasePointerCapture(e.pointerId)}});

  const gallery=document.getElementById('project-gallery');
  const galleryImage=document.getElementById('gallery-image');
  const photos=[
    ['mercedes-feature','Das fertige Fahrzeug.','Weißer Mercedes-Benz 190 E nach der Aufbereitung'],
    ['mercedes-front','Ein Klassiker mit Charakter.','Mercedes von schräg vorne vor einem historischen Gebäude'],
    ['mercedes-rear','Das Finish aus einem anderen Blickwinkel.','Heck des aufbereiteten Mercedes'],
    ['mercedes-paint','Lichtreflexionen auf der Motorhaube.','Weiße Motorhaube mit klaren Lichtreflexionen'],
    ['mercedes-interior','Wieder gern einsteigen.','Aufbereiteter Mercedes-Innenraum mit karierten Stoffsitzen'],
    ['detail-after','Sorgfalt bis in die Tankmulde.','Gereinigte Tankmulde am Mercedes'],
    ['mercedes-profile','Die Linien bleiben. Der Glanz kommt zurück.','Seitliche Ansicht des weißen Mercedes']
  ];
  let photoIndex=0,galleryOpener;
  function showPhoto(index){
    photoIndex=(index+photos.length)%photos.length;
    const [file,caption,alt]=photos[photoIndex];
    galleryImage.src=`assets/projects/${file}.webp`;galleryImage.alt=alt;
    document.getElementById('gallery-caption').textContent=caption;
    document.getElementById('gallery-count').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  }
  document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{galleryOpener=button;showPhoto(Number(button.dataset.gallery));gallery.showModal();document.body.classList.add('modal-open')}));
  document.getElementById('gallery-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
  document.getElementById('gallery-next').addEventListener('click',()=>showPhoto(photoIndex+1));
  gallery.querySelector('.gallery-close').addEventListener('click',()=>gallery.close());
  gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1)}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1)}});
  gallery.addEventListener('click',e=>{const r=gallery.getBoundingClientRect();if(e.target===gallery&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))gallery.close()});
  gallery.addEventListener('close',()=>{document.body.classList.remove('modal-open');galleryOpener?.focus()});

  const form=document.getElementById('inquiry-form');
  const car=document.getElementById('car');
  const steps=[...document.querySelectorAll('[data-form-step]')];
  const markers=[...document.querySelectorAll('.form-progress li')];
  const status=document.getElementById('copy-status');
  const phone='4917630595942';
  function validateCar(){
    const valid=car.value.trim().length>0;
    car.setAttribute('aria-invalid',String(!valid));
    document.getElementById('car-error').textContent=valid?'':'Bitte gib die Marke und das Modell deines Autos ein.';
    if(!valid)car.focus();return valid;
  }
  function messageText(){
    const data=new FormData(form),services=data.getAll('services');
    const name=String(data.get('name')||'').trim(),year=String(data.get('year')||'').trim(),wish=String(data.get('wish')||'').trim();
    return `Hi Tim!${name?' Ich bin '+name+'.':''} Ich interessiere mich für eine Aufbereitung bei Black Magic Detailer.\n\nFahrzeug: ${car.value.trim()}${year?' (Baujahr '+year+')':''}\nZustand: ${data.get('condition')}\nInteresse: ${services.length?services.join(', '):'Persönliche Beratung'}${wish?'\nMein Wunsch: '+wish:''}\n\nKönnen wir einen Termin zur Besichtigung meines Autos vereinbaren?`;
  }
  function updatePreview(){
    const message=messageText();
    document.getElementById('message-preview').textContent=message;
    document.getElementById('whatsapp-link').href=`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    status.textContent='';
  }
  function showStep(index,focus=true){
    steps.forEach((step,i)=>step.hidden=i!==index);
    markers.forEach((marker,i)=>{marker.classList.toggle('current',i===index);marker.classList.toggle('done',i<index);if(i===index)marker.setAttribute('aria-current','step');else marker.removeAttribute('aria-current')});
    if(index===2)updatePreview();
    if(focus){
      const heading=document.getElementById(`form-title-${index}`);
      heading.focus({preventScroll:true});
      const rect=heading.getBoundingClientRect();
      const headerHeight=document.querySelector('.header').offsetHeight;
      if(rect.top<headerHeight+24||rect.bottom>innerHeight-40){
        document.querySelector('.inquiry-panel').scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
      }
    }
  }
  document.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>{if(validateCar())showStep(Number(button.dataset.next))}));
  document.querySelectorAll('[data-back]').forEach(button=>button.addEventListener('click',()=>showStep(Number(button.dataset.back))));
  document.querySelectorAll('[data-contact]').forEach(button=>button.addEventListener('click',()=>{
    if(button.dataset.service){form.querySelectorAll('[name="services"]').forEach(input=>input.checked=input.value===button.dataset.service)}
    closeMenu();showStep(0,false);document.getElementById('kontakt').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});
  }));
  car.addEventListener('input',()=>{if(car.value.trim()){car.removeAttribute('aria-invalid');document.getElementById('car-error').textContent=''}});
  document.getElementById('name').addEventListener('input',updatePreview);
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!validateCar()){showStep(0,false);return}
    const current=steps.findIndex(step=>!step.hidden);
    if(current<2){showStep(current+1);return}
    const url=`https://wa.me/${phone}?text=${encodeURIComponent(messageText())}`;
    window.open(url,'_blank','noopener,noreferrer');
    status.textContent='Deine Nachricht ist für WhatsApp vorbereitet. Sende sie dort selbst ab.';
  });
  document.getElementById('copy-message').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(messageText());status.textContent='Nachricht kopiert. Du kannst sie in deinem Chat mit Tim einfügen.'}
    catch{status.textContent='Kopieren nicht möglich. Markiere den Text in der Vorschau und kopiere ihn manuell.'}
  });
})();
