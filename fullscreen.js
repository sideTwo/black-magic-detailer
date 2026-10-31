(() => {
  'use strict';
  const root = document.documentElement;
  const access = document.querySelector('#fullscreen-access');
  if (!access || !document.fullscreenEnabled || !root.requestFullscreen || !document.exitFullscreen) return;
  const button = access.querySelector('button');
  const status = access.querySelector('[role="status"]');
  const enterIcon = access.querySelector('.fullscreen-enter');
  const exitIcon = access.querySelector('.fullscreen-exit');
  let messageTimer;

  function showError() {
    clearTimeout(messageTimer);
    status.textContent = 'Vollbild ist in diesem Browser gerade nicht verfügbar.';
    status.hidden = false;
    messageTimer = setTimeout(() => { status.hidden = true; }, 6000);
  }

  function syncState() {
    const active = Boolean(document.fullscreenElement);
    const label = active ? 'Vollbildansicht verlassen' : 'Vollbildansicht öffnen';
    button.setAttribute('aria-pressed', String(active));
    button.setAttribute('aria-label', label);
    button.title = label;
    enterIcon.toggleAttribute('hidden', active);
    exitIcon.toggleAttribute('hidden', !active);
  }

  // Native modal dialogs make the rest of the document inert. Keep the one
  // page-level control in the active dialog so it remains usable there too.
  function placeControl() {
    const host = document.querySelector('dialog[open]') || document.body;
    if (access.parentElement !== host) host.append(access);
  }
  const observer = new MutationObserver(placeControl);
  document.querySelectorAll('dialog').forEach(dialog => {
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });

  button.addEventListener('click', async () => {
    clearTimeout(messageTimer); status.hidden = true;
    button.disabled = true;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.requestFullscreen();
    } catch {
      showError();
    } finally {
      button.disabled = false; syncState();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !document.fullscreenElement) return;
    event.preventDefault(); event.stopPropagation();
    document.exitFullscreen().catch(showError);
  }, true);
  document.addEventListener('fullscreenchange', syncState);
  syncState(); placeControl(); access.hidden = false;
})();
