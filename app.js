(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function revealKnowledge(){
    const entry=document.getElementById(location.hash.slice(1));
    if(entry?.matches('.knowledge-list details')){
      entry.open=true;entry.querySelector('summary').focus({preventScroll:true});
    }
  }
  addEventListener('hashchange',revealKnowledge);revealKnowledge();
  // Reveal each section once; the page remains fully visible without JavaScript.
  if(!reduced.matches&&'IntersectionObserver' in window){
    document.documentElement.classList.add('js');
    const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');reveal.unobserve(entry.target)}
    }),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));
  }
  const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('site-nav');
  const mobileMenu=matchMedia('(max-width: 760px)');
  function closeMenu(returnFocus=false){
    const wasOpen=menu.getAttribute('aria-expanded')==='true';
    menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Menü öffnen');nav.classList.remove('open');
    if(wasOpen&&returnFocus)menu.focus({preventScroll:true});
  }
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');nav.classList.toggle('open',open)});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
  addEventListener('keydown',e=>{
    if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){
      e.preventDefault();closeMenu(nav.contains(document.activeElement));
    }
  });
  document.addEventListener('pointerdown',e=>{if(!nav.contains(e.target)&&!menu.contains(e.target))closeMenu()},{passive:true});
  document.addEventListener('focusin',e=>{if(!nav.contains(e.target)&&!menu.contains(e.target))closeMenu()});
  mobileMenu.addEventListener('change',()=>closeMenu(mobileMenu.matches&&nav.contains(document.activeElement)));

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
  updateCompare();

  const gallery=document.getElementById('project-gallery');
  const galleryImage=document.getElementById('gallery-image');
  const projectGalleries={
    classic:{title:'Mercedes-Benz 190 E',photos:[
      ['mercedes-profile-rekonstruiert-v2','Die Linien bleiben. Der Glanz kommt zurück.','Seitliche Ansicht des weißen Mercedes-Benz 190 E'],
      ['mercedes-paint-rekonstruiert-v2','Lichtreflexionen auf der Motorhaube.','Weiße Motorhaube mit klaren Lichtreflexionen'],
      {before:['mercedes-innenraum-vorher-original-v1','Verschmutzter Fahrerbereich des Mercedes-Benz 190 E vor der Reinigung'],after:['mercedes-innenraum-nachher-original-v1','Mercedes-Benz 190 E mit gereinigten karierten Sitzen und Innenraum'],caption:'Innenraum: vor und nach der Reinigung. Aus unterschiedlichen Blickwinkeln fotografiert.'},
      {before:['tankmulde-vorher-original-v1','Verschmutzte Tankmulde des weißen Mercedes-Benz 190 E vor der Reinigung'],after:['tankmulde-nachher-original-v1','Dieselbe Tankmulde des Mercedes-Benz 190 E nach der Reinigung'],caption:'Dieselbe Tankmulde vor und nach der Reinigung. Zwei Originalaufnahmen von Tim.'}
    ]},
    bmw:{title:'BMW · Innenraum & Felgen',photos:[
      ['bmw-suv-felge-20261116-rekonstruiert-v2','Die Felge im Detail.','Nahaufnahme einer gereinigten zweifarbigen BMW-Felge'],
      ['bmw-suv-sitze-20261116-rekonstruiert-v2','Sitze, Nähte und Oberflächen.','BMW-Innenraum mit schwarzen Ledersitzen'],
      ['bmw-suv-cockpit-20261116-rekonstruiert-v2','Ein Blick in den Fahrerbereich.','BMW-Fahrersitz und Cockpit nach der Aufbereitung'],
      ['bmw-suv-fussraum-original-v1','Sorgfalt bis in den Fußraum.','Gereinigter BMW-Beifahrerfußraum mit M-Einstiegsleiste','original']
    ]},
    audi:{title:'Audi TT · Polierablauf & Innenraum',photos:[
      ['audi-politur-schritt-1-original-v1','Polierablauf · Aufnahme 1 von 3. Tim hat die Arbeit am Lack in mehreren Schritten dokumentiert.','Audi-TT-Lack während der Aufbereitung, erste Aufnahme der dokumentierten Polierschritte','original'],
      ['audi-politur-schritt-2-original-v1','Polierablauf · Aufnahme 2 von 3. Ein weiterer dokumentierter Zwischenstand der Lackaufbereitung.','Audi-TT-Lack während der Aufbereitung, zweite Aufnahme der dokumentierten Polierschritte','original'],
      ['audi-politur-schritt-3-original-v1','Polierablauf · Aufnahme 3 von 3. Die dritte Aufnahme aus Tims Dokumentation.','Audi-TT-Lack während der Aufbereitung, dritte Aufnahme der dokumentierten Polierschritte','original'],
      ['audi-sitze-20261116-rekonstruiert-v2','Leder und Kontrastnähte.','Schwarze Audi-Sportsitze mit Rautennähten'],
      ['audi-cockpit-20261116-rekonstruiert-v2','Der Innenraum im Ganzen.','Audi-TT-Cockpit und Sportsitze']
    ]},
    mercedes:{title:'Mercedes-Benz · Innenraum',photos:[
      ['mercedes-kompakt-cockpit-original-v1','Der Fahrerbereich nach der Aufbereitung.','Mercedes-Benz-Cockpit mit Stern im Lenkrad und gereinigtem Fahrerbereich','original'],
      ['mercedes-kompakt-rueckbank-20261116-rekonstruiert-v2','Auch auf der Rückbank.','Mercedes-Rückbank mit schwarzen Sitzen und roten Nähten'],
      ['mercedes-kompakt-kofferraum-20261116-rekonstruiert-v2','Zum Schluss: geordneter Teppichflor.','Gereinigter Kofferraum mit gebürstetem Streifenmuster']
    ]},
    hyundai:{title:'Hyundai · Außen & innen',photos:[
      ['hyundai-seitenansicht-20261116-rekonstruiert-v2','Das Fahrzeug von der Seite.','Dunkler Hyundai in vollständiger Seitenansicht'],
      ['hyundai-sitze-20261116-rekonstruiert-v2','Die Vordersitze im Detail.','Schwarze Hyundai-Vordersitze nach der Aufbereitung'],
      ['hyundai-cockpit-20261116-rekonstruiert-v2','Der Fahrerbereich.','Hyundai-Lenkrad und gereinigtes Cockpit']
    ]},
    skoda:{title:'Škoda · Lack & Innenraum',photos:[
      ['skoda-lackdetail-20261116-rekonstruiert-v2','Klare Reflexionen auf dunklem Lack.','Baumreflexionen auf einer dunklen Škoda-Motorhaube'],
      ['skoda-cockpit-20261116-rekonstruiert-v2','Sitzflächen, Konsole und Cockpit.','Škoda-Innenraum mit schwarzen Sitzen und Rautennähten'],
      ['skoda-kofferraum-20261116-rekonstruiert-v2','Ein sauberer Laderaum.','Gereinigter Škoda-Kofferraum']
    ]},
    paint:{title:'Lackkorrektur · Vorher & nachher',photos:[
      {before:['lack-heck-vorher-original-v1','Mercedes-Heckstoßstange mit hellen Kratz- und Abriebspuren vor der Lackkorrektur'],after:['lack-heck-nachher-original-v1','Dieselbe Mercedes-Heckstoßstange nach der Lackkorrektur'],caption:'Heckstoßstange: vor und nach der Lackkorrektur. Dasselbe Fahrzeug, unterschiedliche Aufnahmewinkel.'},
      {before:['lack-detail-vorher-original-v1','Detail der hellen Kratzspuren an der Mercedes-Heckstoßstange vor der Bearbeitung'],after:['lack-detail-nachher-original-v1','Lackdetail derselben Heckstoßstange nach der Bearbeitung'],caption:'Das Lackdetail im Vergleich. Beide Zustände stammen aus Tims Originalfotos.'}
    ]}
  };
  let activeProject=projectGalleries.classic,photoIndex=0,galleryOpener;
  function showPhoto(index){
    const photos=activeProject.photos;
    photoIndex=(index+photos.length)%photos.length;
    const photo=photos[photoIndex],paired=!Array.isArray(photo);
    gallery.classList.toggle('is-paired',paired);
    galleryImage.hidden=paired;
    document.getElementById('gallery-pair').hidden=!paired;
    let caption;
    if(paired){
      for(const state of ['before','after']){
        const image=document.getElementById(`gallery-${state}`),[file,alt]=photo[state];
        image.src=`assets/projects/${file}.webp`;image.alt=alt;
      }
      caption=photo.caption;
    }else{
      const [file,text,alt]=photo;
      galleryImage.src=`assets/projects/${file}.webp`;galleryImage.alt=alt;caption=text;
    }
    const original=!paired&&photo[3]==='original';
    document.getElementById('gallery-source').textContent=paired?'TIMS ORIGINALFOTOS · VORHER & NACHHER':original?'TIMS ARBEIT · ORIGINALFOTO':'TIMS ARBEIT · FOTOS MIT KI AUFBEREITET';
    document.getElementById('gallery-disclosure').textContent=paired?'Echte Vorher-/Nachher-Aufnahmen von Tim. Für das Web nur verkleinert und komprimiert; die Zustände wurden nicht mit KI rekonstruiert.':original?'Originalaufnahme von Tim. Für das Web nur verkleinert und komprimiert; keine KI-Nachbearbeitung.':'Tims echte Arbeit, fotografisch aufbereitet: KI unterstützt Schärfe, Belichtung und einen ruhigen Hintergrund. Die Bearbeitung soll die Bildqualität verbessern, nicht das Aufbereitungsergebnis.';
    document.getElementById('gallery-title').textContent=activeProject.title;
    document.getElementById('gallery-caption').textContent=caption;
    document.getElementById('gallery-count').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;
  }
  document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{galleryOpener=button;activeProject=projectGalleries[button.dataset.project||'classic']||projectGalleries.classic;showPhoto(Number(button.dataset.gallery));gallery.showModal();document.body.classList.add('modal-open')}));
  document.getElementById('gallery-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
  document.getElementById('gallery-next').addEventListener('click',()=>showPhoto(photoIndex+1));
  gallery.querySelector('.gallery-close').addEventListener('click',()=>gallery.close());
  gallery.addEventListener('keydown',e=>{
    let next;
    if(e.key==='ArrowRight')next=photoIndex+1;
    if(e.key==='ArrowLeft')next=photoIndex-1;
    if(e.key==='Home')next=0;
    if(e.key==='End')next=activeProject.photos.length-1;
    if(next!==undefined){e.preventDefault();showPhoto(next)}
  });
  gallery.addEventListener('click',e=>{const r=gallery.getBoundingClientRect();if(e.target===gallery&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))gallery.close()});
  gallery.addEventListener('close',()=>{document.body.classList.remove('modal-open');galleryOpener?.focus({preventScroll:true})});

  const form=document.getElementById('inquiry-form');
  const car=document.getElementById('car');
  const steps=[...document.querySelectorAll('[data-form-step]')];
  const markers=[...document.querySelectorAll('.form-progress li')];
  const status=document.getElementById('copy-status');
  const phone='491785104313';
  function validateCar(){
    const valid=car.value.trim().length>0;
    car.setAttribute('aria-invalid',String(!valid));
    document.getElementById('car-error').textContent=valid?'':'Bitte gib die Marke und das Modell deines Autos ein.';
    if(!valid){
      // Reveal the invalid field before focusing it, including after autofill.
      if(steps[0].hidden)showStep(0,false);
      car.focus();
    }
    return valid;
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
    closeMenu();showStep(0,false);document.getElementById('form-title-0').focus({preventScroll:true});document.getElementById('kontakt').scrollIntoView({behavior:reduced.matches?'auto':'smooth'});
  }));
  car.addEventListener('input',()=>{if(car.value.trim()){car.removeAttribute('aria-invalid');document.getElementById('car-error').textContent=''}});
  form.addEventListener('input',()=>{if(!steps[2].hidden)updatePreview()});
  // Multi-step forms without a submit button otherwise ignore Enter in many
  // browsers. Keep textarea newlines and checkbox keyboard behavior intact.
  form.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&!e.isComposing&&!e.defaultPrevented&&e.target.matches('input:not([type="checkbox"])')){
      e.preventDefault();form.requestSubmit();
    }
  });
  document.getElementById('whatsapp-link').addEventListener('click',e=>{
    if(!validateCar()){e.preventDefault();return}
    updatePreview();
  });
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
