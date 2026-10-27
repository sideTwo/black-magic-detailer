const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const context = { window: {} };
vm.runInNewContext(readFileSync(path.join(root, 'garage-media.js'), 'utf8'), context);
const services = context.window.BMD_GARAGE;

test('every garage entry resolves to a configured service and an inquiry option', () => {
  const launchers = [...html.matchAll(/data-garage-service="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(launchers).size, 5);
  for (const key of launchers) {
    assert.ok(services[key], `Unconfigured garage service: ${key}`);
    assert.ok(html.includes(`name="services" value="${services[key].service}"`), `Missing inquiry option: ${key}`);
  }
});

test('available films and posters exist; pending treatments never claim a missing movie', () => {
  for (const service of Object.values(services)) {
    if (service.approach) assert.ok(existsSync(path.join(root, service.approach)), service.approach);
    for (const step of service.steps) {
      assert.ok(existsSync(path.join(root, step.poster)), step.poster);
      if (step.video) assert.ok(existsSync(path.join(root, step.video)), step.video);
      else if (step.before && step.after) {
        assert.ok(existsSync(path.join(root, step.before)), step.before);
        assert.ok(existsSync(path.join(root, step.after)), step.after);
      } else assert.ok(step.pending?.length, `Pending film needs a visible explanation: ${step.label}`);
    }
  }
});

test('the entry uses the approved Tim image and cannot load the old scroll movie', () => {
  assert.match(html, /class="garage-image" src="assets\/garage\/tim-garage-foto-v11.webp"/);
  assert.doesNotMatch(html, /src="(?:hero|media-config)\.js|class="story"|mobile-sequence/);
  const player = html.match(/<video[^>]+id="service-film"[^>]*>/)[0];
  assert.match(player, /playsinline/);
  assert.match(player, /preload="none"/);
  assert.doesNotMatch(player, /\bsrc=/);
  assert.match(player, /\bloop\b/);
  assert.match(player, /\bmuted\b/);
  assert.doesNotMatch(player, /\bcontrols\b/);
  assert.doesNotMatch(html, /id="film-play"/);
});
