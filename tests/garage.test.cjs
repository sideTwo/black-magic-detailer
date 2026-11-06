const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');

// Exercise lifecycle and inquiry behavior without claiming browser rendering QA.
function fixture(reduced = false) {
  let document;
  class Element extends EventTarget {
    constructor() {
      super(); this.children = []; this.dataset = {}; this.hidden = false;
      this.style = { setProperty(name, value) { this[name] = value; } };
      const classes = new Set();
      this.classList = {
        add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name),
        toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name); }
      };
      this.error = null; this.paused = true; this.src = ''; this.attributes = {};
    }
    append(...nodes) { this.children.push(...nodes); }
    prepend(...nodes) { this.children.unshift(...nodes); }
    replaceChildren(...nodes) { this.children = nodes; }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    removeAttribute(name) { delete this.attributes[name]; if (name === 'src') this.src = ''; }
    focus() { document.activeElement = this; }
    showModal() { this.open = true; }
    close() { this.open = false; this.dispatchEvent(new Event('close')); }
    load() { this.error = null; }
    pause() { this.paused = true; }
    play() {
      if (this.rejectPlay) return Promise.reject(new Error('Autoplay denied'));
      this.paused = false; this.dispatchEvent(new Event('playing')); return Promise.resolve();
    }
    emit(type) { this.dispatchEvent(new Event(type)); }
  }
  const elements = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(m => [m[1], new Element()]));
  const target = new EventTarget();
  document = { getElementById: id => elements[id], createElement: () => new Element(), body: new Element(), hidden: false,
    addEventListener: target.addEventListener.bind(target), emit: type => target.dispatchEvent(new Event(type)) };
  elements.inquiry.elements = Object.fromEntries(['name', 'vehicle', 'service', 'message'].map(key => [key, new Element()]));
  const opened = [];
  const window = { matchMedia: () => ({ matches: reduced }), open: (...args) => opened.push(args) };
  const context = { window, document, AbortController, requestAnimationFrame: fn => fn(),
    FormData: class { constructor(form) { this.form = form; } get(name) { return this.form.elements[name].value || ''; } } };
  vm.runInNewContext(readFileSync(path.join(root, 'garage-media.js'), 'utf8'), context);
  vm.runInNewContext(readFileSync(path.join(root, 'rebuild.js'), 'utf8'), context);
  return { elements, document, opened, data: window.BMD_GARAGE,
    open(index) { elements['service-nav'].children[index].emit('click'); },
    players: [elements.film, elements['film-next']] };
}

test('all six categories have accessible launchers, cards and a matching inquiry option', () => {
  const f = fixture();
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, 'Page IDs must be unique');
  for (const id of ['hotspots', 'service-nav', 'service-cards']) assert.equal(f.elements[id].children.length, 6);
  for (const item of Object.values(f.data)) assert.ok(html.includes(`<option>${item.service}</option>`), item.service);
  for (const b of f.elements.hotspots.children) assert.equal(b.attributes['aria-haspopup'], 'dialog');
  assert.ok(f.players.every(p => !p.src), 'No film downloads before selecting a category');
});

test('all referenced local media, fonts and page assets exist', () => {
  const f = fixture();
  const paths = [...html.matchAll(/(?:src|href)="((?:assets\/|rebuild|fullscreen|garage-media)[^"]+)"/g)].map(m => m[1]);
  for (const item of Object.values(f.data)) {
    if (item.approach) paths.push(item.approach);
    for (const step of item.steps) for (const key of ['poster', 'video', 'before', 'after']) if (step[key]) paths.push(step[key]);
  }
  const css = readFileSync(path.join(root, 'rebuild.css'), 'utf8');
  for (const m of css.matchAll(/url\('([^']+)'\)/g)) paths.push(m[1]);
  for (const file of paths) assert.ok(existsSync(path.join(root, file)), file);
  assert.match(html, /tim-garage-v16-wide.webp/);
  assert.doesNotMatch(html, /src="(?:hero|media-config|garage|app)\.js/);
});

test('wash approach plays once, then only its silent treatment loops and the camera is released', () => {
  const f = fixture(); f.open(1);
  assert.equal(f.players[0].src, f.data.wash.approach);
  assert.equal(f.players[1].src, f.data.wash.steps[0].video);
  assert.equal(f.players[0].loop, false);
  assert.equal(f.players[1].paused, true);
  f.players[0].emit('ended');
  assert.equal(f.players[0].src, '');
  assert.equal(f.players[1].loop, true);
  assert.equal(f.players[1].paused, false);
  for (const p of f.players) { assert.equal(p.controls, false); assert.equal(p.muted, true); assert.equal(p.volume, 0); }
});

test('closing cancels the pending sequence, releases both files and restores focus', () => {
  const f = fixture(); f.open(4); f.elements.viewer.close();
  f.players[0].emit('ended');
  assert.ok(f.players.every(p => !p.src && p.paused));
  assert.equal(f.document.activeElement, f.elements['service-nav'].children[4]);
  assert.equal(f.document.body.classList.contains('modal-open'), false);
});

test('rejected leather and camera candidates stay excluded; ceramic opens the film, never its old slider', () => {
  const f = fixture(); f.open(3);
  assert.ok(f.players.every(p => !p.src));
  assert.match(f.elements['film-note'].textContent, /noch nicht verfügbar/);
  for (const i of [0, 2]) { f.open(i); assert.ok(f.players[0].loop); assert.equal(f.players[1].src, ''); }
  f.open(5);
  assert.match(f.players[0].src, /keramik-abperlen/);
  assert.equal(f.elements['paint-comparison'].hidden, true);
  assert.match(f.elements['film-note'].textContent, /links unversiegeltem und rechts versiegeltem/);
});

test('polish comparison releases the film and its range supports both endpoints', () => {
  const f = fixture(); f.open(2);
  f.elements['viewer-steps'].children[1].emit('click');
  assert.ok(f.players.every(p => !p.src));
  assert.equal(f.elements['paint-comparison'].hidden, false);
  assert.match(f.elements['paint-before'].src, /lack-vorher/);
  assert.match(f.elements['paint-after'].src, /lack-nachher/);
  for (const value of ['0', '100']) {
    f.elements['paint-range'].value = value; f.elements['paint-range'].emit('input');
    assert.equal(f.elements['paint-comparison'].style['--split'], value + '%');
  }
  f.elements['viewer-steps'].children[0].emit('click');
  assert.equal(f.elements['paint-comparison'].hidden, true);
  assert.equal(f.players[0].paused, false);
});

test('autoplay failure offers retry; reduced motion skips the camera route', async () => {
  const f = fixture(true); f.players[0].rejectPlay = true; f.open(1);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.players[0].src, f.data.wash.steps[0].video);
  assert.equal(f.players[1].src, '');
  assert.equal(f.elements.retry.hidden, false);
  f.players[0].rejectPlay = false; f.elements.retry.emit('click');
  assert.equal(f.elements.retry.hidden, true);
  assert.equal(f.players[0].paused, false);
});

test('service inquiry prefills the form and opens only an encoded WhatsApp draft', () => {
  const f = fixture(); f.open(4); f.elements['service-inquiry'].emit('click');
  const form = f.elements.inquiry;
  assert.equal(form.elements.service.value, 'Innenraumaufbereitung');
  assert.equal(f.document.activeElement, form.elements.name);
  form.elements.name.value = ' Björn & Co. '; form.elements.vehicle.value = 'BMW #1'; form.elements.message.value = 'Leder? 50%';
  form.emit('submit');
  const url = new URL(f.opened[0][0]);
  assert.equal(url.host, 'wa.me'); assert.equal(url.pathname, '/4917630595942');
  assert.match(url.searchParams.get('text'), /Björn & Co\./);
  assert.match(url.searchParams.get('text'), /BMW #1\n/);
  assert.match(url.searchParams.get('text'), /Innenraumaufbereitung/);
  assert.match(url.searchParams.get('text'), /Leder\? 50%/);
  assert.equal(f.opened[0][2], 'noopener,noreferrer');
});
