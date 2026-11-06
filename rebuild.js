(() => {
  'use strict';
  const data = window.BMD_GARAGE;
  const order = ['wheels', 'wash', 'polish', 'leather', 'cargo', 'ceramic'];
  const points = { wheels: [52, 69], wash: [30, 49], polish: [59.5, 48.5], leather: [47.5, 39], cargo: [25, 40], ceramic: [69.5, 50] };
  const $ = id => document.getElementById(id);
  const dialog = $('viewer'), players = [$('film'), $('film-next')], retry = $('retry');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active, opener, events, revision = 0, currentPlayer, focusAfterClose;

  function button(text, action) {
    const element = document.createElement('button');
    element.type = 'button'; element.textContent = text;
    element.addEventListener('click', action);
    return element;
  }
  function launcher(text, key) {
    const element = button(text, () => open(key, element));
    element.setAttribute('aria-haspopup', 'dialog');
    return element;
  }
  order.forEach((key, index) => {
    const item = data[key], step = item.steps.find(s => s.video) || item.steps[0];
    const spot = launcher(item.title, key);
    spot.className = 'hotspot';
    spot.style.left = points[key][0] + '%'; spot.style.top = points[key][1] + '%';
    const plus = document.createElement('i');
    plus.textContent = '+'; plus.setAttribute('aria-hidden', 'true'); spot.prepend(plus);
    $('hotspots').append(spot);
    const nav = launcher(item.title, key), number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    nav.prepend(number); $('service-nav').append(nav);
    const card = document.createElement('article'); card.className = 'card';
    const n = document.createElement('span'); n.className = 'number'; n.textContent = number.textContent;
    const title = document.createElement('h3'); title.textContent = item.service;
    const description = document.createElement('p'); description.textContent = step.description;
    const link = launcher(key === 'leather' ? 'Bildvorlage ansehen' : 'Filmvorschau ansehen', key);
    const arrow = document.createElement('span'); arrow.className = 'arrow'; arrow.setAttribute('aria-hidden', 'true'); link.append(arrow);
    card.append(n, title, description, link); $('service-cards').append(card);
  });

  function release() {
    revision++; events?.abort();
    for (const player of players) {
      player.pause(); player.removeAttribute('src'); player.load(); player.classList.remove('ready');
      player.preload = 'none';
    }
    currentPlayer = null; retry.hidden = true; $('loading').hidden = true;
  }
  function prepare(player, src, loop) {
    player.muted = true; player.defaultMuted = true; player.volume = 0;
    player.controls = false; player.loop = loop; player.preload = 'auto'; player.src = src;
    player.load();
  }
  function start(player, token) {
    if (token !== revision || !dialog.open) return;
    currentPlayer = player; $('loading').hidden = false;
    player.play().catch(() => {
      if (token === revision) {
        $('loading').hidden = true; retry.textContent = 'Film starten'; retry.hidden = false;
      }
    });
  }
  function playSequence(approach, treatment) {
    const token = revision; events = new AbortController();
    for (const player of players) {
      player.addEventListener('playing', () => {
        if (token !== revision) return;
        // Keep the outgoing image until the next film actually has a decoded frame.
        for (const other of players) other.classList.toggle('ready', other === player);
        $('loading').hidden = true; retry.hidden = true;
      }, { signal: events.signal });
      player.addEventListener('error', () => {
        if (player !== currentPlayer) return;
        $('loading').hidden = true; retry.textContent = 'Film erneut laden'; retry.hidden = false;
      }, { signal: events.signal });
      player.addEventListener('waiting', () => {
        if (player === currentPlayer) $('loading').hidden = false;
      }, { signal: events.signal });
    }
    if (approach && !reducedMotion.matches) {
      prepare(players[0], approach, false);
      // Only the chosen treatment is buffered; no other category downloads a film.
      prepare(players[1], treatment, true);
      players[0].addEventListener('ended', () => start(players[1], token), { once: true, signal: events.signal });
      players[1].addEventListener('playing', () => {
        players[0].pause(); players[0].removeAttribute('src'); players[0].load();
      }, { once: true, signal: events.signal });
      start(players[0], token);
    } else {
      prepare(players[0], treatment, true); start(players[0], token);
    }
  }
  function showStep(index, useApproach = false) {
    release();
    const item = data[active], step = item.steps[index];
    const comparison = Boolean(step.before && step.after);
    $('viewer-title').textContent = comparison ? step.title : item.service;
    $('viewer-description').textContent = step.description;
    $('poster').src = step.poster; $('poster').alt = item.service + ' – Bildvorschau';
    $('viewer-status').textContent = step.video ? 'Filmvorschau · Ohne Ton' : comparison ? 'Lackbild im Vergleich' : 'Neue Filmsequenz in Arbeit';
    $('film-note').textContent = step.pending || (active === 'ceramic'
      ? 'KI-Visualisierung · Vorhandener Abperlfilm. Die neue Animation mit links unversiegeltem und rechts versiegeltem Lack steht noch aus.'
      : 'KI-Visualisierung · Vorhandenes Filmmaterial zur Vorschau des neuen Aufbaus. Noch kein neu produzierter finaler Clip.');
    $('paint-comparison').hidden = !comparison;
    $('poster').hidden = comparison;
    [...$('viewer-steps').children].forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.step) === index)));
    if (comparison) {
      $('paint-before').src = step.before; $('paint-after').src = step.after;
      $('paint-before').alt = 'KI-Visualisierung: Lack mit feinen Waschkratzern unter einer Prüfleuchte';
      $('paint-after').alt = 'KI-Visualisierung: gleiche Lackfläche mit klarerer Reflexion nach der Korrektur';
      $('paint-range').value = '50'; $('paint-comparison').style.setProperty('--split', '50%');
    } else if (step.video) {
      // Rejected approaches and leather footage stay excluded until their camera motion is corrected.
      const approach = useApproach && ['wash', 'cargo'].includes(active) ? item.approach : null;
      playSequence(approach, step.video);
    }
  }
  function open(key, source) {
    active = key; opener = source;
    const item = data[key], stepIndex = Math.max(0, item.steps.findIndex(s => s.video));
    $('viewer-steps').replaceChildren();
    // Ceramic stays a film, as requested; the still-image slider is not used for it.
    if (key === 'polish') [0, 1].forEach(index => {
      const b = button(item.steps[index].label, () => showStep(index));
      b.dataset.step = index; b.setAttribute('aria-pressed', String(index === stepIndex));
      $('viewer-steps').append(b);
    });
    $('viewer-steps').hidden = key !== 'polish';
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open'); showStep(stepIndex, true);
  }

  $('close-viewer').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    release(); document.body.classList.remove('modal-open');
    (focusAfterClose || opener)?.focus({ preventScroll: true }); focusAfterClose = null;
  });
  retry.addEventListener('click', () => {
    if (!currentPlayer) return;
    retry.hidden = true;
    if (currentPlayer.error) currentPlayer.load();
    start(currentPlayer, revision);
  });
  $('paint-range').addEventListener('input', event => {
    $('paint-comparison').style.setProperty('--split', event.target.value + '%');
  });
  $('service-inquiry').addEventListener('click', () => {
    $('inquiry').elements.service.value = data[active].service;
    focusAfterClose = $('inquiry').elements.name; dialog.close();
  });
  $('inquiry').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = `Hallo Tim, ich bin ${form.get('name').trim()}.\nMein Fahrzeug: ${form.get('vehicle').trim()}\nInteresse: ${form.get('service')}\n${form.get('message').trim()}\nIch würde gerne eine Besichtigung vereinbaren.`;
    window.open('https://wa.me/4917630595942?text=' + encodeURIComponent(message), '_blank', 'noopener,noreferrer');
  });
  document.addEventListener('visibilitychange', () => {
    if (!dialog.open || !currentPlayer) return;
    if (document.hidden) currentPlayer.pause();
    else start(currentPlayer, revision);
  });
})();
