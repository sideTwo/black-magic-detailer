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
  const play = document.querySelector('#film-play');
  const pending = document.querySelector('#film-pending');
  const error = document.querySelector('#film-error');
  const steps = document.querySelector('#film-steps');
  const contact = document.querySelector('#film-contact');
  const comparison = document.querySelector('#film-compare');
  const paintRange = document.querySelector('#paint-range');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let selected = 'polish', currentStep = 0, opener, revision = 0, layoutQueued = false;

  // Coordinates refer to the original photograph, including cover cropping.
  function layout() {
    layoutQueued = false;
    const width = scene.clientWidth, height = scene.clientHeight;
    const sourceWidth = Number(car.getAttribute('width')), sourceHeight = Number(car.getAttribute('height'));
    const scale = Math.max(width / sourceWidth, height / sourceHeight);
    const renderedWidth = sourceWidth * scale, renderedHeight = sourceHeight * scale;
    const focusX = width <= 600 ? .54 : .5;
    const left = (width - renderedWidth) * focusX, top = (height - renderedHeight) * .2;
    car.style.objectPosition = `${focusX * 100}% 20%`;
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
    revision++; video.pause(); video.removeAttribute('src'); video.load();
  }
  function playFilm() {
    if (!video.getAttribute('src')) return;
    const attemptRevision = revision;
    video.play()?.catch(() => {
      if (attemptRevision === revision && dialog.open) play.hidden = false;
    });
  }
  function setStep(index, autoplay = true) {
    const service = media[selected];
    if (!service?.steps[index]) return;
    currentStep = index;
    const step = service.steps[index];
    releaseFilm();
    const hasComparison = Boolean(step.before && step.after);
    error.hidden = true; pending.hidden = Boolean(step.video) || hasComparison; play.hidden = true;
    video.hidden = !step.video;
    document.querySelector('#film-still').hidden = Boolean(step.video) || hasComparison;
    document.querySelector('#film-still').src = step.poster;
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
    video.setAttribute('aria-label', `${service.title}: ${step.title}`);
    [...steps.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    if (step.video) {
      video.src = step.video; video.load();
      if (autoplay) playFilm(); else play.hidden = false;
    }
  }
  function openService(key, source) {
    const service = media[key];
    if (!service) return;
    selected = key; opener = source;
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
    document.body.classList.add('modal-open'); setStep(0);
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
    releaseFilm(); document.body.classList.remove('modal-open');
    if (!dialog.dataset.contactExit) opener?.focus({ preventScroll: true });
    delete dialog.dataset.contactExit;
  });
  contact.addEventListener('click', () => { dialog.dataset.contactExit = 'true'; dialog.close(); });
  play.addEventListener('click', playFilm);
  video.addEventListener('playing', () => { play.hidden = true; error.hidden = true; });
  video.addEventListener('pause', () => {
    if (dialog.open && video.getAttribute('src') && error.hidden) play.hidden = false;
  });
  video.addEventListener('ended', () => { play.hidden = false; play.setAttribute('aria-label', 'Film wiederholen'); });
  video.addEventListener('loadstart', () => play.setAttribute('aria-label', 'Film abspielen'));
  video.addEventListener('error', () => { if (video.getAttribute('src')) { error.hidden = false; play.hidden = true; } });
  document.querySelector('#film-retry').addEventListener('click', () => setStep(currentStep));
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
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) video.pause();
  }).observe(garage);
  reduced.addEventListener('change', () => video.pause());
  if ('ResizeObserver' in window) new ResizeObserver(queueLayout).observe(scene);
  addEventListener('resize', queueLayout, { passive: true });
  const header = document.querySelector('.header');
  function updateHeader() { header.classList.toggle('scrolled', scrollY > 40); }
  addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); queueLayout();
})();
