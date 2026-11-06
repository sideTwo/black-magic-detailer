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
  const learn = document.querySelector('#film-learn');
  const comparison = document.querySelector('#film-compare');
  const paintRange = document.querySelector('#paint-range');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 'polish', currentStep = 0, opener, revision = 0, layoutQueued = false, camera;
  let approach, knowledgeTarget, warmedApproach;
  function createApproachFilm() {
    const film = document.createElement('video');
    film.muted = true; film.defaultMuted = true; film.playsInline = true;
    film.controls = false; film.disablePictureInPicture = true;
    film.setAttribute('muted', ''); film.setAttribute('playsinline', '');
    film.setAttribute('disablepictureinpicture', ''); film.setAttribute('disableremoteplayback', '');
    film.tabIndex = -1; film.poster = car.currentSrc || car.src;
    return film;
  }
  function discardWarmApproach() {
    if (!warmedApproach) return;
    const film = warmedApproach.film; warmedApproach = null;
    film.pause(); film.removeAttribute('src'); film.load();
  }
  function warmApproach(key, preload = 'auto') {
    const source = media[key]?.approach;
    if (!source || innerWidth <= 760 || reduced.matches || dialog.open || document.hidden || navigator.connection?.saveData) return;
    if (warmedApproach?.source === source) {
      if (preload === 'auto') warmedApproach.film.preload = 'auto';
      return;
    }
    discardWarmApproach();
    const film = createApproachFilm();
    film.preload = preload; film.src = source;
    warmedApproach = { source, film }; film.load();
  }
  function stopApproach() {
    if (approach) {
      approach.animations.forEach(animation => animation.cancel());
      approach.timers?.forEach(clearTimeout);
      if (approach.frameCallback !== undefined) video.cancelVideoFrameCallback?.(approach.frameCallback);
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
    const layer = document.createElement('div'); layer.className = 'camera-flight camera-film';
    layer.style.setProperty('--film-ambient', `url("${car.currentSrc || car.src}")`);
    layer.setAttribute('aria-hidden', 'true');
    const film = warmedApproach?.source === service.approach ? warmedApproach.film : createApproachFilm();
    if (warmedApproach?.film === film) warmedApproach = null;
    else discardWarmApproach();
    film.preload = 'auto';
    // One full-width image frame: identical cover fit and position for the
    // hero and the moving video. No static scenery remains beside the film.
    for (const dimension of ['left', 'top', 'width', 'height']) layer.style[dimension] = `${origin[dimension]}px`;
    layer.style.right = 'auto'; layer.style.bottom = 'auto';
    layer.append(film);
    dialog.append(layer); dialog.classList.add('camera-filming');
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
      // Prepare the treatment while the camera travels, after the approach's
      // first frame is playing so two cold movies do not compete at the click.
      if (video.getAttribute('src')) { video.preload = 'auto'; video.load(); }
      const duration = Number.isFinite(film.duration) ? film.duration : 4;
      current.timers.push(setTimeout(fallback, (duration + 12) * 1000));
    }, {once:true});
    film.addEventListener('ended', () => {
      if (!active()) return;
      current.timers.forEach(clearTimeout); current.timers = [];
      if (!video.getAttribute('src')) { reveal(); return; }
      // Keep the last camera frame visible until the treatment has actually
      // presented a frame. play() resolving alone can expose the poster/black.
      if (video.requestVideoFrameCallback) {
        current.frameCallback = video.requestVideoFrameCallback(() => {
          current.frameCallback = undefined; reveal();
        });
      }
      playFilm()?.then(() => {
        if (!active()) return;
        if (!video.requestVideoFrameCallback) reveal();
        else current.timers.push(setTimeout(reveal, 1500));
      }).catch(() => { if (active()) stopApproach(); });
    }, {once:true});
    film.addEventListener('error', fallback, {once:true});
    current.timers.push(setTimeout(fallback, 10000));
    if (film.getAttribute('src') !== service.approach) film.src = service.approach;
    film.play()?.catch(fallback);
  }
  // Carry the current garage photograph toward the selected part before
  // blending to the film. Coordinates are in the original, uncropped photo.
  function approachService(key, origin) {
    stopApproach();
    if (media[key]?.steps[0]?.pending) return;
    if (reduced.matches || origin.bottom < 80 || origin.top > innerHeight - 80) return;
    if (canUseFilmedApproach(media[key], origin)) { filmedApproach(media[key], origin); return; }
    const target = document.querySelector('.film-screen').getBoundingClientRect();
    const positions = {
      wheels: [.51, .72, 4.4], polish: [.64, .485, 2.8],
      leather: [.46, .39, 4.4], cargo: [.12, .45, 3.6],
      wash: [.615, .48, 2.4], ceramic: [.79, .51, 4.8]
    };
    const [x, y, magnification] = positions[key];
    const sw = Number(car.getAttribute('width')), sh = Number(car.getAttribute('height'));
    const cover = Math.max(origin.width / sw, origin.height / sh);
    const width = sw * cover, height = sh * cover;
    const left = origin.left + (origin.width - width) * .5;
    const top = origin.top + (origin.height - height) * .4;
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
    const focusX = .5;
    const focusY = .4;
    const left = (width - renderedWidth) * focusX, top = (height - renderedHeight) * focusY;
    car.style.objectPosition = `${focusX * 100}% ${focusY * 100}%`;
    pins.forEach(pin => {
      const x = left + Number(innerWidth <= 760 ? pin.dataset.mobileX || pin.dataset.x : pin.dataset.x) * renderedWidth;
      const y = top + Number(innerWidth <= 760 ? pin.dataset.mobileY || pin.dataset.y : pin.dataset.y) * renderedHeight;
      pin.style.left = `${x}px`; pin.style.top = `${y}px`;
      pin.classList.toggle('pin-flip', x + pin.offsetWidth > width - 18);
      pin.classList.toggle('out-of-view', x < 25 || x > width - 25 || y < 25 || y > height - 25);
    });
  }
  function queueLayout() { if (!layoutQueued) { layoutQueued = true; requestAnimationFrame(layout); } }
  function releaseFilm() {
    camera?.cancel(); camera = null;
    revision++; video.pause(); video.removeAttribute('src'); video.preload = 'none'; video.load();
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
    learn.setAttribute('href', `#${step.knowledge || service.knowledge}`);
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
      document.querySelector('#paint-before').alt = step.beforeAlt || 'KI-Visualisierung: feine Waschspuren vor der Politur';
      document.querySelector('#paint-after').alt = step.afterAlt || 'KI-Visualisierung: glattes Lackbild nach der Politur';
      comparison.querySelector('.paint-before-label').textContent = step.beforeLabel || 'VORHER';
      comparison.querySelector('.paint-after-label').textContent = step.afterLabel || 'NACHHER';
      comparison.style.setProperty('--compare-zoom', step.zoom || 1);
      paintRange.setAttribute('aria-label', step.comparisonLabel || 'Lackbild vor und nach der Politur vergleichen');
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
      video.preload = autoplay ? 'auto' : 'metadata';
      video.src = step.video; video.load();
      if (autoplay) playFilm();
    }
  }
  function positionCinema(origin) {
    dialog.classList.toggle('cinema-immersive', Boolean(media[selected].approach && innerWidth > 760));
    // Anchor the cinema to the garage instead of opening a different crop
    // across the viewport. These bounds remain fixed during the sequence.
    const onScreen = origin.bottom > 80 && origin.top < innerHeight - 80;
    const frame = onScreen ? origin : {
      left: 0, top: 0, width: document.documentElement.clientWidth, height: innerHeight
    };
    const top = Math.max(0, frame.top);
    const bottom = Math.min(innerHeight, frame.top + frame.height);
    dialog.style.setProperty('--cinema-left', `${frame.left}px`);
    dialog.style.setProperty('--cinema-top', `${top}px`);
    dialog.style.setProperty('--cinema-width', `${frame.width}px`);
    dialog.style.setProperty('--cinema-height', `${bottom - top}px`);
    dialog.style.setProperty('--cinema-frame-top', `${frame.top - top}px`);
    dialog.style.setProperty('--cinema-frame-height', `${frame.height}px`);
  }
  function openService(key, source) {
    const service = media[key];
    if (!service) return;
    const origin = scene.getBoundingClientRect();
    selected = key; opener = source;
    positionCinema(origin);
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
    document.body.style.setProperty('--modal-page-width', `${header.getBoundingClientRect().width}px`);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open'); setStep(0, !canUseFilmedApproach(service, origin));
    approachService(key, origin);
  }
  launchers.forEach(button => {
    for (const event of ['pointerenter', 'focusin', 'pointerdown']) {
      button.addEventListener(event, () => warmApproach(button.dataset.garageService), { passive: true });
    }
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
    document.body.style.removeProperty('--modal-page-width');
    if (knowledgeTarget) {
      const entry = knowledgeTarget; knowledgeTarget = null;
      entry.open = true;
      if (location.hash !== `#${entry.id}`) history.pushState(null, '', `#${entry.id}`);
      entry.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'instant' : 'smooth' });
      entry.querySelector('summary').focus({ preventScroll: true });
    } else if (!dialog.dataset.contactExit) opener?.focus({ preventScroll: true });
    delete dialog.dataset.contactExit;
  });
  contact.addEventListener('click', () => { dialog.dataset.contactExit = 'true'; dialog.close(); });
  learn.addEventListener('click', event => {
    const entry = document.getElementById(learn.hash.slice(1));
    if (!entry?.matches('.knowledge-list details')) return;
    event.preventDefault(); knowledgeTarget = entry;
    dialog.dataset.contactExit = 'true'; dialog.close();
  });
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
    const beforeLabel = comparison.querySelector('.paint-before-label').textContent;
    const afterLabel = comparison.querySelector('.paint-after-label').textContent;
    paintRange.setAttribute('aria-valuetext', `${value} Prozent ${beforeLabel}, ${100 - value} Prozent ${afterLabel}`);
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
      discardWarmApproach();
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
  reduced.addEventListener('change', () => { discardWarmApproach(); cancelApproach(); camera?.cancel(); camera = null; });
  addEventListener('resize', () => {
    cancelApproach();
    if (!dialog.open) return;
    positionCinema(scene.getBoundingClientRect());
    document.body.style.removeProperty('--modal-page-width');
    document.body.style.setProperty('--modal-page-width', `${header.getBoundingClientRect().width}px`);
  }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(queueLayout).observe(scene);
  addEventListener('resize', queueLayout, { passive: true });
  const header = document.querySelector('.header');
  function updateHeader() { header.classList.toggle('scrolled', scrollY > 40); }
  addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); queueLayout();
  // Fetch only the wheel movie's metadata after the page is ready. Intent
  // upgrades this one reusable element to auto preload; other films stay cold.
  function primeWheelApproach() {
    const prime = () => {
      const bounds = scene.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < innerHeight && !warmedApproach) warmApproach('wheels', 'metadata');
    };
    if ('requestIdleCallback' in window) requestIdleCallback(prime, { timeout: 1500 });
    else setTimeout(prime, 800);
  }
  if (document.readyState === 'complete') primeWheelApproach();
  else addEventListener('load', primeWheelApproach, { once: true });
})();
