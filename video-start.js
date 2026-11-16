// Keep the media clock stopped until its opening frame can be shown.
(() => {
  'use strict';
  window.BMD_VIDEO_START = (video, { active = () => true, reveal = () => {} } = {}) => {
    const events = ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'progress', 'seeked'];
    let cancelled = false, requested = false, starting = false, started = false;
    let pending, resolve, reject, poll;
    video.autoplay = false;
    video.pause();
    const abort = () => new DOMException('Playback superseded', 'AbortError');
    const valid = () => !cancelled && active();
    const cleanup = () => {
      clearInterval(poll);
      events.forEach(event => video.removeEventListener(event, check));
      video.removeEventListener('error', failed);
    };
    function failed() {
      cleanup();
      reject?.(video.error || new Error('Video could not be loaded'));
    }
    function check() {
      if (!requested || starting || !valid() || document.hidden) return;
      // A reused element may still be seeking back from the previous run.
      if (video.readyState < 1 || video.seeking) return;
      if (video.currentTime > .001) { video.currentTime = 0; return; }
      if (video.readyState < 3) return;
      const required = Math.min(1.5, Number.isFinite(video.duration) ? video.duration : 1.5);
      let buffered = false;
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= .05 && video.buffered.end(i) >= required) buffered = true;
      }
      if (!buffered) return;
      starting = true;
      cleanup();
      // The independent loading cover handles the poster. Remove the native
      // poster now so the paused, decoded opening frame is actually visible.
      video.removeAttribute('poster');
      // Reveal while paused, including any cover fade. Then give the browser
      // a paint before play(), so an invisible film cannot consume seconds.
      Promise.resolve().then(() => { if (!valid()) throw abort(); return reveal(); })
        .then(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))))
        .then(() => {
          if (!valid()) throw abort();
          if (document.hidden) {
            starting = false; listen(); return;
          }
          return video.play().then(() => { started = true; resolve(); });
        }).catch(reason => { starting = false; pending = null; reject?.(reason); });
    }
    function listen() {
      events.forEach(event => video.addEventListener(event, check));
      video.addEventListener('error', failed);
      poll = setInterval(check, 100);
    }
    return {
      play() {
        if (!valid()) return Promise.reject(abort());
        if (started) return video.play();
        if (pending) return pending;
        pending = new Promise((yes, no) => { resolve = yes; reject = no; });
        requested = true;
        video.preload = 'auto';
        listen();
        if (video.error) failed(); else check();
        return pending;
      },
      cancel() {
        cancelled = true; cleanup(); video.pause(); reject?.(abort());
      }
    };
  };
})();
