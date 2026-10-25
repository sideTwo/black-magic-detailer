# Project workflow

- The active public source is this repository: https://github.com/sideTwo/black-magic-detailer. Publish completed, checked work to main, wait for GitHub Pages, and verify https://sidetwo.github.io/black-magic-detailer/. The user explicitly authorized ongoing live updates.
- Current direction, agreed with Tim on 2026-10-25: replace the scroll-controlled film with an interactive detailing garage inspired by a car tuning menu. Do not restore scroll scrubbing or a pinned multi-screen hero.
- The start image is assets/tim-finish-sharp.webp: Tim with black gloves near the front wheel of the white BMW G31 Touring. Preserve the approved smile, position and vehicle.
- garage.js controls the garage and film dialog; garage-media.js contains service/film configuration; garage.css controls the new experience. app.js controls the existing content and inquiry. Old hero.js, media-config.js and image-sequence assets are historical and are not loaded.
- Areas: Polieren, Felgen, Leder, Außenwäsche/Snow Foam, Keramik. Polieren has three selectable views: Politur, Lackbild, Keramik. Current approved separate films: assets/polish-film.mp4 and assets/ceramic-film.mp4.
- Felgen, Leder and Snow Foam films plus matching before/after paint material are still to be created by the user in Artlist. Their config video values are null and the UI clearly says the film follows. Never substitute unrelated footage or imply that missing films exist. Prompts are in ARTLIST-GARAGE-CLIPS.txt in the parent workspace.
- Load/play films only after a user selects a service. Use inline native playback, actual elapsed video time, and normal controls. Clear the source when closing or switching, and preserve a manual play/retry path for restricted playback. No videos or frame sequences download automatically on page load.
- Pin coordinates refer to the original 1672x941 photograph. Keep pins aligned with cover cropping at every breakpoint; the complete service menu remains available when a pin falls outside the mobile crop. Keep Tim's face clear of text.
- Brand: black, champagne gold #c9ab77 and silver, clean locally hosted sans-serif fonts. Use inline SVG icons, never Unicode arrows that become colorful iOS emoji. Keep 16px mobile form inputs and accessible touch targets.
- Tim inspects each car personally before quoting an individual price. No flat rates, invented projects, reviews, prices or certifications. The Mercedes project and Tim portrait below the garage are original photos.
- The guided inquiry opens WhatsApp with a prepared message to the approved temporary number +49 176 30595942; it never sends automatically. Selecting a service in the garage must preselect the matching service in the form.
- Original footage and personal references stay outside the public repo; publish only the web derivatives. Tattoo correction of the old polishing film awaits close-up references.
- Business address and email have not been supplied. Do not fabricate legal or contact information.
- Check desktop and mobile (including 320px), film selection/playback/closing, focus restoration, pending states and correct form selection before publication.
