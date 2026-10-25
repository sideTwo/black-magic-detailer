const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

// Test lifecycle failures without requiring an autoplay-capable browser.
function fixture({ reduced = false, portrait = false } = {}) {
  const raf = [], timers = new Map(), created = [], media = new Map();
  let timerId = 0, scroll = 0, time = 0;
  function element() {
    const classes = new Set(), listeners = {};
    return {
      style: { setProperty(name, value) { this[name] = value; } }, dataset: {},
      classList: { add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x),
        toggle(x, on) { on ? classes.add(x) : classes.delete(x); } },
      setAttribute(name, value) { this[name] = value; }, removeAttribute(name) { delete this[name]; },
      addEventListener(name, listener) { (listeners[name] ||= []).push(listener); },
      emit(name) { (listeners[name] || []).forEach(fn => fn()); },
      append() {}, remove() { this.removed = true; }, getContext() { return { drawImage() {} }; },
      load() {}, play() { return Promise.reject(new Error('Autoplay denied')); }, pause() {},
      getBoundingClientRect: () => ({ top: -scroll, bottom: 2800 - scroll }),
      offsetHeight: 2800, duration: 17.5, currentTime: 0, seeking: false,
    };
  }
  const story = element(), stage = element(), visuals = Array.from({ length: 5 }, element);
  const copies = Array.from({ length: 5 }, element), visualStage = element();
  stage.offsetHeight = 1000;
  const nodes = { '.story': story, '.stage': stage, '.visuals': visualStage, '.header': element(), '.story-progress span': element(), '.scroll-cue': element() };
  const document = {
    hidden: false, querySelector: s => nodes[s],
    querySelectorAll: s => s === '.visual' ? visuals : copies,
    createElement(tag) { const node = element(); node.tag = tag; created.push(node); return node; },
    addEventListener() {},
  };
  const context = {
    document, window: { BMD_MEDIA: { sequence: 'sequence.mp4' } }, innerHeight: 1000, scrollY: 0,
    matchMedia(query) {
      if (!media.has(query)) {
        const node = element(); node.matches = query.includes('reduced') ? reduced : portrait; media.set(query, node);
      }
      return media.get(query);
    },
    requestAnimationFrame: fn => raf.push(fn), addEventListener() {}, scrollBy() {},
    setTimeout(fn) { timers.set(++timerId, fn); return timerId; }, clearTimeout: id => timers.delete(id),
    AbortController, URL, Image: class {},
    fetch: async () => { throw new Error('Connection unavailable'); },
  };
  vm.runInNewContext(readFileSync(require.resolve('../hero.js'), 'utf8'), context);
  function frame() { const tasks = raf.splice(0); time += 16; tasks.forEach(fn => fn(time)); }
  return { story, visuals, copies, created, timers, media, context, frame,
    scroll(value) { scroll = value; context.scrollY = value; },
    renderUntilSettled() { for (let i = 0; i < 160 && raf.length; i++) frame(); },
  };
}

test('reduced motion creates no video or frame downloads', () => {
  const f = fixture({ reduced: true }); f.frame();
  assert.equal(f.created.length, 0);
  assert.equal(f.story.classList.contains('has-scroll'), false);
  assert.equal(f.copies[0]['aria-hidden'], 'false');
});

test('portrait uses image frames and never creates a video, even offline', async () => {
  const f = fixture({ portrait: true }); f.frame();
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(f.created.map(node => node.tag), ['canvas']);
  assert.equal(f.visuals[0].style.opacity, '1');
  assert.equal(f.created[0].classList.contains('ready'), false);
});

test('a stalled desktop seek falls back to stills; captions wait for completed seeks', () => {
  const f = fixture(); f.frame();
  const video = f.created[0]; video.emit('loadeddata');
  f.scroll(800); f.renderUntilSettled();
  assert.ok(video.currentTime > 5);
  assert.equal(f.copies[0]['aria-hidden'], 'false');
  assert.ok(f.timers.size > 0);
  [...f.timers.values()].forEach(fn => fn()); f.frame();
  assert.equal(video.classList.contains('ready'), false);
  assert.equal(f.copies[2]['aria-hidden'], 'false');
});

test('motion preference changes dispose media without reloading the document', () => {
  const f = fixture(); f.frame();
  const video = f.created[0], motion = f.media.get('(prefers-reduced-motion: reduce)');
  motion.matches = true; motion.emit('change'); f.frame();
  assert.equal(video.removed, true);
  assert.equal(f.story.classList.contains('has-scroll'), false);
  assert.equal(f.copies[0].style.opacity, '1');
});

test('a fast fling lands on the final sharp image before pin release', () => {
  const f = fixture({ portrait: true });
  f.scroll(1720); f.renderUntilSettled();
  assert.equal(f.visuals[4].style.opacity, '1');
  assert.equal(f.copies[4]['aria-hidden'], 'false');
});
