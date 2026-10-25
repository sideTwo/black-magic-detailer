(() => {
  'use strict';
  const story = document.querySelector('.story');
  const stage = document.querySelector('.stage');
  const visualStage = document.querySelector('.visuals');
  const header = document.querySelector('.header');
  const visuals = [...document.querySelectorAll('.visual')];
  const copies = [...document.querySelectorAll('[data-copy]')];
  const bar = document.querySelector('.story-progress span');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const portrait = matchMedia('(max-width: 600px)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const stops = [0, .185, .351, .672, .88];
  const focusStops = [0, .185, .351, .55, .672, .88, .97];
  const focus = [60, 55, 26, 26, 48, 42, 42];
  const filmEnd = .97, journeyEnd = .78;
  let renderer, queued = false, displayed = 0, lastTick = 0;
  let inView = true, activeCopy = -1;

  // Portrait frames are independent of autoplay, video seeking and Low Power
  // Mode. Keep compressed frames, but only a small window of decoded images.
  function createFrames() {
    const canvas = document.createElement('canvas');
    canvas.className = 'sequence-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('2d', { alpha: false });
    const abort = new AbortController();
    const blobs = new Map(), decoded = new Map();
    const fetching = new Set(), decoding = new Set(), failed = new Set();
    let manifest, desired = 0, drawn = -1, disposed = false;
    visualStage.append(canvas);

    function nearest() {
      return [...decoded.keys()].sort((a, b) => Math.abs(a - desired) - Math.abs(b - desired))[0];
    }
    function decode(index) {
      if (disposed || decoding.has(index) || decoded.has(index) || !blobs.has(index) || decoding.size >= 2) return;
      decoding.add(index);
      const image = new Image();
      const url = URL.createObjectURL(blobs.get(index));
      image.src = url;
      image.decode().then(() => {
        if (disposed) return;
        decoded.set(index, image);
        // Approximately 31 MB maximum for 12 full-resolution portrait frames.
        while (decoded.size > 12) {
          const oldest = [...decoded.keys()].sort((a, b) => Math.abs(b - desired) - Math.abs(a - desired))[0];
          decoded.delete(oldest);
        }
      }).catch(() => failed.add(index)).finally(() => {
        URL.revokeObjectURL(url);
        decoding.delete(index);
        if (!disposed) { schedule(); prepare(); }
      });
    }
    function prepare() {
      if (!manifest || disposed || !inView || document.hidden) return;
      // Always put the requested frame ahead of speculative loading.
      const order = Array.from({ length: manifest.count }, (_, i) => i)
        .sort((a, b) => Math.abs(a - desired) - Math.abs(b - desired));
      order.filter(i => blobs.has(i) && !failed.has(i)).slice(0, 4).forEach(decode);
      for (const index of order) {
        if (fetching.size >= 4) break;
        if (blobs.has(index) || fetching.has(index) || failed.has(index)) continue;
        fetching.add(index);
        fetch(`assets/mobile-sequence/${String(index).padStart(3, '0')}.webp`, { signal: abort.signal })
          .then(response => { if (!response.ok) throw new Error('Frame unavailable'); return response.blob(); })
          .then(blob => { if (!disposed) blobs.set(index, blob); })
          .catch(() => { if (!disposed) failed.add(index); })
          .finally(() => { fetching.delete(index); if (!disposed) { prepare(); schedule(); } });
      }
    }
    fetch('assets/mobile-sequence/manifest.json', { signal: abort.signal })
      .then(response => { if (!response.ok) throw new Error('Sequence unavailable'); return response.json(); })
      .then(data => {
        if (disposed || !context) return;
        manifest = data;
        canvas.width = data.width; canvas.height = data.height;
        canvas.dataset.frames = data.count;
        prepare(); schedule();
      }).catch(() => { /* The five lightweight stills remain visible. */ });

    return {
      update(value) {
        if (!manifest || !context) return null;
        desired = Math.round(clamp(value / filmEnd) * (manifest.count - 1));
        prepare();
        const index = nearest();
        // A slow connection must not leave an unrelated old shot on screen.
        const available = index !== undefined && Math.abs(index - desired) <= 12;
        canvas.classList.toggle('ready', available);
        if (!available) return null;
        if (index !== drawn) {
          context.drawImage(decoded.get(index), 0, 0);
          drawn = index;
          canvas.dataset.frame = index;
        }
        return index / (manifest.count - 1) * filmEnd;
      },
      prime() {},
      dispose() {
        disposed = true; abort.abort(); canvas.remove(); blobs.clear(); decoded.clear();
      }
    };
  }

  function createVideo() {
    const video = document.createElement('video');
    video.className = 'sequence-video';
    video.muted = true; video.defaultMuted = true; video.playsInline = true; video.preload = 'auto';
    ['muted', 'playsinline', 'webkit-playsinline', 'disablepictureinpicture'].forEach(name => video.setAttribute(name, ''));
    video.setAttribute('aria-hidden', 'true');
    let ready = false, disposed = false, broken = false, priming = false, primed = false;
    let requested = 0, completed = 0, watchdog;
    const duration = () => Math.max(1 / 24, (video.duration || 0) - 1 / 24);
    function fail() {
      broken = true; ready = false; clearTimeout(watchdog);
      video.pause(); video.classList.remove('ready'); schedule();
    }
    function seek() {
      if (!ready || broken || disposed || video.seeking || !Number.isFinite(video.duration)) return;
      if (Math.abs(completed - requested) <= 1 / 48) return;
      try {
        video.currentTime = requested;
        clearTimeout(watchdog);
        watchdog = setTimeout(fail, 2200);
      } catch { fail(); }
    }
    function prime() {
      if (disposed || broken || priming || primed) return;
      priming = true;
      const attempt = video.play();
      if (attempt) attempt.then(() => {
        video.pause(); priming = false; primed = true;
        if (!disposed) { seek(); schedule(); }
      }).catch(() => { priming = false; });
    }
    video.addEventListener('loadedmetadata', prime);
    video.addEventListener('loadeddata', () => {
      ready = true; completed = video.currentTime;
      video.classList.add('ready'); seek(); schedule();
    });
    // currentTime changes immediately on request; only use completed seeks
    // for captions, otherwise text can race ahead of the decoded picture.
    video.addEventListener('seeked', () => {
      clearTimeout(watchdog); completed = video.currentTime;
      video.dataset.frameTime = completed.toFixed(3); schedule();
    });
    video.addEventListener('error', fail);
    video.src = window.BMD_MEDIA?.sequence || '';
    visualStage.append(video); video.load();
    return {
      update(value) {
        requested = clamp(value / filmEnd) * duration();
        if (inView && !document.hidden) seek();
        return ready && !broken ? completed / duration() * filmEnd : null;
      },
      prime,
      dispose() {
        disposed = true; clearTimeout(watchdog); video.pause();
        video.removeAttribute('src'); video.load(); video.remove();
      }
    };
  }

  function reset() {
    renderer?.dispose(); renderer = null;
    activeCopy = -1;
    story.classList.toggle('has-scroll', !reduced.matches);
    visuals.forEach((el, i) => { el.style.opacity = i === 0 ? '1' : '0'; });
    copies.forEach((el, i) => {
      el.style.opacity = i === 0 ? '1' : '0'; el.style.transform = 'none';
      el.setAttribute('aria-hidden', String(i !== 0));
    });
    displayed = clamp(-story.getBoundingClientRect().top / Math.max(1, story.offsetHeight - stage.offsetHeight) / journeyEnd);
    lastTick = 0; schedule();
  }
  function render(now) {
    queued = false;
    const bounds = story.getBoundingClientRect();
    const raw = clamp(-bounds.top / Math.max(1, story.offsetHeight - stage.offsetHeight));
    inView = bounds.bottom > 0 && bounds.top < innerHeight;
    header.classList.toggle('scrolled', scrollY > 40);
    if (reduced.matches || document.hidden) return;
    if (!renderer && inView) renderer = portrait.matches ? createFrames() : createVideo();
    const target = clamp(raw / journeyEnd);
    const dt = Math.min(64, lastTick ? now - lastTick : 16); lastTick = now;
    displayed += (target - displayed) * (1 - Math.exp(-dt / 140));
    if (Math.abs(target - displayed) < .0005 || !inView) displayed = target;
    const landed = raw >= .94;
    if (landed) displayed = 1;
    const decoded = renderer?.update(displayed);
    const frame = landed ? filmEnd : decoded ?? displayed;
    const active = stops.reduce((current, start, i) => frame >= start ? i : current, 0);
    if (portrait.matches) {
      const position = focusStops.reduce((current, start, i) => frame >= start ? i : current, 0);
      const next = Math.min(position + 1, focus.length - 1);
      const mix = clamp((frame - focusStops[position]) / ((focusStops[next] ?? 1) - focusStops[position] || 1));
      const eased = mix * mix * (3 - 2 * mix);
      visualStage.style.setProperty('--film-focus-x', `${focus[position] + (focus[next] - focus[position]) * eased}%`);
    }
    const finishOpacity = frame >= filmEnd - .003 ? clamp((displayed - .97) / .03) : 0;
    visuals.forEach((el, i) => {
      el.style.opacity = String(i === 4 ? finishOpacity : i === Math.min(active, 3) ? 1 : 0);
    });
    copies.forEach((el, i) => {
      const end = stops[i + 1] ?? 1.1;
      const opacity = i === active ? Math.min(i === 0 ? 1 : clamp((frame - stops[i]) / .045), clamp((end - frame) / .045)) : 0;
      el.style.opacity = opacity;
      el.style.transform = `translateY(${(1 - opacity) * 12}px)`;
      if (active !== activeCopy) el.setAttribute('aria-hidden', String(i !== active));
    });
    activeCopy = active;
    bar.style.transform = `scaleX(${raw})`;
    if (inView && displayed !== target) schedule();
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(render); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  story.addEventListener('pointerdown', () => renderer?.prime(), { passive: true });
  story.addEventListener('touchend', () => renderer?.prime(), { passive: true });
  reduced.addEventListener('change', reset);
  portrait.addEventListener('change', reset);
  document.querySelector('.scroll-cue').addEventListener('click', event => {
    if (reduced.matches) return;
    event.preventDefault(); scrollBy({ top: innerHeight * .35, behavior: 'smooth' });
  });
  reset();
})();
