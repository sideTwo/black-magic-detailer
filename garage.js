(() => {
  'use strict';
  const garage = document.querySelector('.garage');
  if (!garage) return;
  const media = window.BMD_GARAGE || {};
  const scene = document.querySelector('.garage-photo');
  const car = document.querySelector('.garage-image');
  const pins = [...document.querySelectorAll('.garage-pin')];
  const launchers = [...document.querySelectorAll('[data-garage-service]')];
  const dialog = document.querySelector('#service-cinema');
  const video = document.querySelector('#service-film');
  const pending = document.querySelector('#film-pending');
  const error = document.querySelector('#film-error');
  const retry = document.querySelector('#film-retry');
  const steps = document.querySelector('#film-steps');
  const contact = document.querySelector('#film-contact');
  const comparison = document.querySelector('#film-compare');
  const paintRange = document.querySelector('#paint-range');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 'polish', currentStep = 0, opener, revision = 0, layoutQueued = false, camera;
  let approach;
  function stopApproach() {
    if (approach) {
      approach.animations.forEach(animation => animation.cancel());
      approach.timers?.forEach(clearTimeout);
      if (approach.film) {
        approach.film.pause(); approach.film.removeAttribute('src'); approach.film.load();
      }
      approach.layer.remove(); approach = null;
    }
    dialog.classList.remove('camera-arriving', 'camera-filming');
    dialog.querySelector('.cinema-body').inert = false;
    dialog.querySelector('.cinema-bottom').inert = false;
  }
  function canUseFilmedApproach(service, origin) {
    return Boolean(service.approach && innerWidth > 760 && !reduced.matches &&
      origin.bottom > 80 && origin.top < innerHeight - 80);
  }
  function filmedApproach(service, origin) {
    const screen = document.querySelector('.film-screen').getBoundingClientRect();
    const fittedWidth = Math.min(screen.width, screen.height * 16 / 9);
    const target = {
      left: screen.left + (screen.width - fittedWidth) / 2,
      top: screen.top + (screen.height - fittedWidth * 9 / 16) / 2,
      width: fittedWidth, height: fittedWidth * 9 / 16
    };
    const layer = document.createElement('div'); layer.className = 'camera-flight camera-film';
    layer.style.setProperty('--film-ambient', `url("${car.currentSrc || car.src}")`);
    layer.setAttribute('aria-hidden', 'true');
    const film = document.createElement('video');
    film.muted = true; film.defaultMuted = true; film.playsInline = true;
    film.controls = false; film.preload = 'auto'; film.disablePictureInPicture = true;
    film.setAttribute('muted', ''); film.setAttribute('playsinline', '');
    film.setAttribute('disablepictureinpicture', ''); film.setAttribute('disableremoteplayback', '');
    film.tabIndex = -1; film.poster = car.currentSrc || car.src;
    Object.assign(film.style, {left:`${origin.left}px`, top:`${origin.top}px`, width:`${origin.width}px`, height:`${origin.height}px`});
    layer.append(film); dialog.append(layer); dialog.classList.add('camera-filming');
    dialog.querySelector('.cinema-body').inert = true;
    dialog.querySelector('.cinema-bottom').inert = true;
    const current = {layer, film, animations:[], timers:[], revision}; approach = current;
    const active = () => approach === current && revision === current.revision && dialog.open;
    const fallback = () => { if (active()) { stopApproach(); playFilm(); } };
    const reveal = () => {
      if (!active()) return;
      dialog.classList.remove('camera-filming');
      dialog.querySelector('.cinema-body').inert = false;
      dialog.querySelector('.cinema-bottom').inert = false;
      const fade = layer.animate([{opacity:1},{opacity:0}], {duration:220,fill:'both'});
      current.animations.push(fade);
      fade.finished.then(() => { if (active()) stopApproach(); }).catch(() => {});
    };
    film.addEventListener('playing', () => {
      if (!active()) return;
      current.timers.forEach(clearTimeout); current.timers = [];
      const duration = Number.isFinite(film.duration) ? film.duration : 4;
      const move = film.animate([
        {left:`${origin.left}px`,top:`${origin.top}px`,width:`${origin.width}px`,height:`${origin.height}px`,offset:0},
        {left:`${target.left}px`,top:`${target.top}px`,width:`${target.width}px`,height:`${target.height}px`,offset:1}
      ], {duration:200,easing:'cubic-bezier(.22,.61,.36,1)',fill:'both'});
      current.animations.push(move);
      current.animations.push(layer.animate([
        {backgroundColor:'#080a0b22'}, {backgroundColor:'#080a0b'}
      ], {duration:200,fill:'both'}));
      current.timers.push(setTimeout(fallback, (duration + 12) * 1000));
    }, {once:true});
    film.addEventListener('ended', () => {
      if (!active()) return;
      current.timers.forEach(clearTimeout); current.timers = [];
      playFilm()?.then(reveal).catch(() => { if (active()) stopApproach(); });
    }, {once:true});
    film.addEventListener('error', fallback, {once:true});
    current.timers.push(setTimeout(fallback, 10000));
    film.src = service.approach;
    film.play()?.catch(fallback);
  }
  // Carry the current garage photograph toward the selected part before
  // blending to the film. Coordinates are in the original, uncropped photo.
  function approachService(key, origin) {
    stopApproach();
    if (reduced.matches || origin.bottom < 80 || origin.top > innerHeight - 80) return;
    if (canUseFilmedApproach(media[key], origin)) { filmedApproach(media[key], origin); return; }
    const target = document.querySelector('.film-screen').getBoundingClientRect();
    const positions = {
      wheels: [.51, .72, 4.4], polish: [.64, .485, 2.8],
      leather: [.46, .39, 4.4], wash: [.67, .49, 2.4], ceramic: [.79, .51, 4.8]
    };
    const [x, y, magnification] = positions[key];
    const sw = Number(car.getAttribute('width')), sh = Number(car.getAttribute('height'));
    const cover = Math.max(origin.width / sw, origin.height / sh);
    const width = sw * cover, height = sh * cover;
    const left = origin.left + (origin.width - width) * (origin.width <= 600 ? .35 : .5);
    const top = origin.top + (origin.height - height) * (innerWidth > 760 ? .6 : .2);
    const finalWidth = target.width * magnification, scale = finalWidth / width;
    const dx = target.left + target.width / 2 - x * finalWidth - left;
    const dy = target.top + target.height / 2 - y * height * scale - top;
    const layer = document.createElement('div'); layer.className = 'camera-flight';
    layer.setAttribute('aria-hidden', 'true');
    const image = document.createElement('img'); image.src = car.currentSrc || car.src; image.alt = '';
    Object.assign(image.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });
    layer.append(image); dialog.append(layer); dialog.classList.add('camera-arriving');
    const clip = rect => `inset(${Math.max(0, rect.top)}px ${Math.max(0, innerWidth - rect.right)}px ${Math.max(0, innerHeight - rect.bottom)}px ${Math.max(0, rect.left)}px)`;
    const timing = { duration: 1350, easing: 'cubic-bezier(.4,0,.16,1)', fill: 'both' };
    const animations = [
      image.animate([{transform:'translate(0,0) scale(1)'}, {transform:`translate(${dx}px,${dy}px) scale(${scale})`}], timing),
      layer.animate([{clipPath:clip(origin)}, {clipPath:clip(target)}], timing),
      layer.animate([{opacity:1,offset:0},{opacity:1,offset:.7},{opacity:0,offset:1}], {duration:1350,fill:'both'})
    ];
    const current = { layer, animations }; approach = current;
    animations[0].finished.then(() => { if (approach === current) stopApproach(); }).catch(() => {});
  }

  // Coordinates refer to the original photograph, including cover cropping.
  function layout() {
    layoutQueued = false;
    const width = scene.clientWidth, height = scene.clientHeight;
    const sourceWidth = Number(car.getAttribute('width')), sourceHeight = Number(car.getAttribute('height'));
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const renderedWidth = sourceWidth * scale, renderedHeight = sourceHeight * scale;
    const focusX = width <= 600 ? .35 : .5;
    const focusY = innerWidth > 760 ? .6 : .2;
    const left = (width - renderedWidth) * focusX, top = (height - renderedHeight) * focusY;
    car.style.objectPosition = `${focusX * 100}% ${focusY * 100}%`;
    pins.forEach(pin => {
      const x = left + Number(pin.dataset.x) * renderedWidth;
      const y = top + Number(pin.dataset.y) * renderedHeight;
      pin.style.left = `${x}px`; pin.style.top = `${y}px`;
      pin.classList.toggle('pin-flip', x + pin.offsetWidth > width - 18);
      pin.classList.toggle('out-of-view', x < 25 || x > width - 25 || y < 25 || y > height - 25);
    });
  }
  function queueLayout() { if (!layoutQueued) { layoutQueued = true; requestAnimationFrame(layout); } }
  function releaseFilm() {
    camera?.cancel(); camera = null;
    revision++; video.pause(); video.removeAttribute('src'); video.load();
  }
  function playFilm() {
    if (!video.getAttribute('src')) return;
    if (document.hidden) return Promise.resolve();
    const attemptRevision = revision;
    video.muted = true;
    const playback = video.play();
    playback?.catch(reason => {
      if (attemptRevision !== revision || !dialog.open || reason.name === 'AbortError') return;
      error.querySelector('p').textContent = 'Tippe einmal, um die Animation zu starten.';
      retry.textContent = 'Animation starten';
      error.hidden = false;
    });
    return playback;
  }
  function setStep(index, autoplay = true) {
    const service = media[selected];
    if (!service?.steps[index]) return;
    stopApproach();
    currentStep = index;
    const step = service.steps[index];
    releaseFilm();
    const hasComparison = Boolean(step.before && step.after);
    error.hidden = true; pending.hidden = Boolean(step.video) || hasComparison;
    video.hidden = !step.video;
    document.querySelector('#film-still').hidden = Boolean(step.video) || hasComparison;
    document.querySelector('#film-still').src = step.poster;
    document.querySelector('.film-screen').style.setProperty('--film-ambient', `url("${step.poster}")`);
    comparison.hidden = !hasComparison;
    if (hasComparison) {
      document.querySelector('#paint-before').src = step.before;
      document.querySelector('#paint-after').src = step.after;
      paintRange.value = 50; updatePaint();
    }
    document.querySelector('#film-title').textContent = step.title;
    document.querySelector('#film-description').textContent = step.description;
    document.querySelector('#film-pending-text').textContent = step.pending || '';
    video.poster = step.poster;
    video.style.transformOrigin = step.focus || '50% 50%';
    video.setAttribute('aria-label', `${service.title}: ${step.title}`);
    [...steps.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (step.video) {
      video.autoplay = autoplay;
      video.src = step.video; video.load();
      if (autoplay) playFilm();
    }
  }
  function openService(key, source) {
    const service = media[key];
    if (!service) return;
    const origin = scene.getBoundingClientRect();
    selected = key; opener = source;
    dialog.classList.toggle('cinema-immersive', Boolean(service.approach && innerWidth > 760));
    launchers.forEach(button => button.classList.toggle('selected', button.dataset.garageService === key));
    document.querySelector('#film-eyebrow').textContent = service.eyebrow;
    document.querySelector('#film-service-title').textContent = service.title.replace('Außenwäsche', 'Außen\u200bwäsche');
    document.querySelector('#film-service-copy').textContent = service.description;
    contact.dataset.service = service.service;
    contact.querySelector('.film-contact-label').textContent = `${service.title} anfragen`;
    steps.replaceChildren();
    service.steps.forEach((step, index) => {
      const button = document.createElement('button'); button.type = 'button';
      const number = document.createElement('span'); number.textContent = String(index + 1).padStart(2, '0');
      const name = document.createElement('span'); name.textContent = step.label;
      button.append(number, name); button.addEventListener('click', () => setStep(index)); steps.append(button);
    });
    steps.hidden = service.steps.length < 2;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open'); setStep(0, !canUseFilmedApproach(service, origin));
    approachService(key, origin);
  }
  launchers.forEach(button => {
    button.addEventListener('click', () => openService(button.dataset.garageService, button));
    button.addEventListener('mouseenter', () => launchers.forEach(el => el.classList.toggle('hovered', el.dataset.garageService === button.dataset.garageService)));
    button.addEventListener('mouseleave', () => launchers.forEach(el => el.classList.remove('hovered')));
  });
  document.querySelector('#cinema-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    stopApproach();
    dialog.classList.remove('cinema-immersive');
    releaseFilm(); document.body.classList.remove('modal-open');
    if (!dialog.dataset.contactExit) opener?.focus({ preventScroll: true });
    delete dialog.dataset.contactExit;
  });
  contact.addEventListener('click', () => { dialog.dataset.contactExit = 'true'; dialog.close(); });
  video.addEventListener('playing', () => {
    error.hidden = true;
    const zoom = media[selected]?.steps[currentStep]?.zoom || 1;
    if (!camera && zoom > 1 && !reduced.matches) {
      camera = video.animate([{ transform: 'scale(1)' }, { transform: `scale(${zoom})` }], {
        duration: 1100, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards'
      });
    }
  });
  video.addEventListener('error', () => {
    if (!video.getAttribute('src')) return;
    error.querySelector('p').textContent = 'Die Animation konnte nicht geladen werden.';
    retry.textContent = 'Erneut versuchen'; error.hidden = false;
  });
  retry.addEventListener('click', () => setStep(currentStep));
  function updatePaint() {
    const value = Number(paintRange.value);
    comparison.style.setProperty('--split', `${value}%`);
    paintRange.setAttribute('aria-valuetext', `${value} Prozent Vorher, ${100 - value} Prozent Nachher`);
    comparison.querySelector('.paint-before-label').hidden = value < 8;
    comparison.querySelector('.paint-after-label').hidden = value > 92;
  }
  paintRange.addEventListener('input', updatePaint);
  function movePaint(event) {
    const rect = paintRange.getBoundingClientRect();
    paintRange.value = Math.round(Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100)));
    updatePaint();
  }
  paintRange.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault(); paintRange.focus({ preventScroll: true });
    paintRange.setPointerCapture(event.pointerId); movePaint(event);
  });
  paintRange.addEventListener('pointermove', event => { if (paintRange.hasPointerCapture(event.pointerId)) movePaint(event); });
  paintRange.addEventListener('pointerup', event => {
    if (paintRange.hasPointerCapture(event.pointerId)) { movePaint(event); paintRange.releasePointerCapture(event.pointerId); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      video.pause(); approach?.film?.pause();
      approach?.animations.forEach(animation => animation.pause());
    }
    else if (dialog.open) {
      approach?.animations.forEach(animation => animation.play());
      if (approach?.film && !approach.film.ended) {
        const current = approach;
        current.film.play()?.catch(() => { if (approach === current) { stopApproach(); playFilm(); } });
      }
      else if (video.getAttribute('src')) playFilm();
    }
  });
  function cancelApproach() {
    const wasFilming = Boolean(approach?.film); stopApproach();
    if (wasFilming && dialog.open) playFilm();
  }
  reduced.addEventListener('change', () => { cancelApproach(); camera?.cancel(); camera = null; });
  addEventListener('resize', cancelApproach, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(queueLayout).observe(scene);
  addEventListener('resize', queueLayout, { passive: true });
  const header = document.querySelector('.header');
  function updateHeader() { header.classList.toggle('scrolled', scrollY > 40); }
  addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); queueLayout();
})();
