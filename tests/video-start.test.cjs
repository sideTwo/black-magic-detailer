const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = readFileSync(path.join(__dirname, '../video-start.js'), 'utf8');

function fixture() {
  const paints = [], timers = new Set(), order = [];
  const document = {hidden: false};
  const video = new EventTarget();
  Object.assign(video, {
    autoplay: true, paused: false, readyState: 0, currentTime: 0,
    duration: 13, seeking: false, error: null, end: 0, playCalls: 0,
    pause() { this.paused = true; },
    removeAttribute(name) { if (name === 'poster') this.poster = ''; },
    play() { order.push('play'); this.playCalls++; this.paused = false; return Promise.resolve(); }
  });
  video.buffered = {length: 1, start: () => 0, end: () => video.end};
  const window = {};
  vm.runInNewContext(source, {
    window, document, DOMException,
    requestAnimationFrame: callback => paints.push(callback),
    setInterval: callback => { timers.add(callback); return callback; },
    clearInterval: callback => timers.delete(callback)
  });
  const tick = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
  return {video, document, order, timers, create: window.BMD_VIDEO_START, tick,
    async paint() { paints.splice(0).forEach(callback => callback()); await tick(); },
    emit(event) { video.dispatchEvent(new Event(event)); }
  };
}

test('cold start waits at zero for a playable buffer, reveals, paints, then plays', async () => {
  const f = fixture();
  const gate = f.create(f.video, {reveal: () => f.order.push('reveal')});
  assert.equal(f.video.paused, true);
  assert.equal(f.video.autoplay, false);
  const playback = gate.play();
  f.video.readyState = 3; f.video.end = .2; f.emit('canplay'); await f.tick();
  assert.deepEqual(f.order, []);
  f.video.end = 1.6; f.emit('progress'); await f.tick();
  assert.deepEqual(f.order, ['reveal']);
  assert.equal(f.video.currentTime, 0);
  assert.equal(f.video.paused, true);
  await f.paint(); assert.equal(f.video.playCalls, 0);
  await f.paint(); await playback;
  assert.deepEqual(f.order, ['reveal', 'play']);
  assert.equal(f.timers.size, 0);
});

test('reopened film seeks to zero and waits for seek completion', async () => {
  const f = fixture();
  f.video.readyState = 4; f.video.end = 13; f.video.currentTime = 7;
  const gate = f.create(f.video, {reveal: () => f.order.push('reveal')});
  const playback = gate.play(); await f.tick();
  assert.equal(f.video.currentTime, 0);
  assert.deepEqual(f.order, []);
  f.video.seeking = true; f.emit('canplay'); await f.tick();
  assert.deepEqual(f.order, []);
  f.video.seeking = false; f.emit('seeked'); await f.tick();
  await f.paint(); await f.paint(); await playback;
  assert.deepEqual(f.order, ['reveal', 'play']);
});

test('the treatment stays paused until the previous camera layer finishes fading', async () => {
  const f = fixture(); let finishFade;
  f.video.readyState = 4; f.video.end = 13;
  const gate = f.create(f.video, {reveal: () => new Promise(done => { finishFade = done; })});
  const playback = gate.play(); await f.tick();
  await f.paint(); await f.paint();
  assert.equal(f.video.playCalls, 0);
  finishFade(); await f.tick(); await f.paint(); await f.paint(); await playback;
  assert.equal(f.video.playCalls, 1);
});

test('switching category during loading or a cover fade cannot start the old film', async () => {
  for (const ready of [false, true]) {
    const f = fixture(); let finishFade;
    if (ready) { f.video.readyState = 4; f.video.end = 13; }
    const gate = f.create(f.video, {reveal: () => new Promise(done => { finishFade = done; })});
    const playback = gate.play();
    const rejected = assert.rejects(playback, {name: 'AbortError'});
    await f.tick(); gate.cancel(); finishFade?.();
    await f.tick(); await f.paint(); await f.paint(); await rejected;
    f.video.readyState = 4; f.video.end = 13; f.emit('canplay'); await f.tick();
    assert.equal(f.video.playCalls, 0);
    assert.equal(f.timers.size, 0);
  }
});

test('background tabs do not silently consume the opening seconds', async () => {
  const f = fixture();
  f.document.hidden = true; f.video.readyState = 4; f.video.end = 13;
  const gate = f.create(f.video);
  const playback = gate.play(); await f.tick();
  assert.equal(f.video.playCalls, 0);
  f.document.hidden = false; f.emit('canplay'); await f.tick();
  await f.paint(); await f.paint(); await playback;
  assert.equal(f.video.playCalls, 1);
});

test('repeated play requests share one start and do not rewind an already playing film', async () => {
  const f = fixture();
  f.video.readyState = 4; f.video.end = 13;
  const gate = f.create(f.video);
  const playback = gate.play();
  assert.equal(gate.play(), playback);
  await f.tick(); await f.paint(); await f.paint(); await playback;
  f.video.currentTime = 4;
  await gate.play();
  assert.equal(f.video.currentTime, 4);
});

test('hiding the tab during a fade holds the media clock until the tab returns', async () => {
  const f = fixture(); let finishFade;
  f.video.readyState = 4; f.video.end = 13;
  const gate = f.create(f.video, {reveal: () => new Promise(done => { finishFade = done; })});
  const playback = gate.play(); await f.tick();
  f.document.hidden = true; finishFade(); await f.tick();
  await f.paint(); await f.paint();
  assert.equal(f.video.playCalls, 0);
  f.document.hidden = false; f.emit('canplay'); await f.tick();
  finishFade(); await f.tick(); await f.paint(); await f.paint(); await playback;
  assert.equal(f.video.playCalls, 1);
});

test('short films can start fully buffered and media failures remain retryable', async () => {
  const f = fixture();
  f.video.duration = .8; f.video.end = .8; f.video.readyState = 3;
  const gate = f.create(f.video);
  const playback = gate.play(); await f.tick();
  await f.paint(); await f.paint(); await playback;
  assert.equal(f.video.playCalls, 1);
  const failed = fixture();
  const failedGate = failed.create(failed.video);
  const rejected = assert.rejects(failedGate.play(), /Video could not be loaded/);
  failed.emit('error'); await rejected;
  assert.equal(failed.timers.size, 0);
});
