# Project workflow

- This repository is the current source for the public website at https://sidetwo.github.io/black-magic-detailer/.
- The user explicitly requests that completed website changes always be published live on GitHub. After appropriate checks, commit and push to main, wait for GitHub Pages deployment and verify the public URL. No additional conversational publication confirmation is needed.
- Preserve the short scroll distance: 1.8 desktop viewport heights, 1.6 mobile viewport heights for the pinned animation.
- Use the latest approved Tim image: black gloves, standing close to the car just left of its visible front wheel. The final pullback uses seconds 3–5 of tim_standing_beside_car_40288_Kling_30_.mp4 after a brief white reflection transition. Its final hold uses assets/tim-finish-sharp.webp from the approved original image, rather than a soft video-frame export. Tattoo corrections to the polishing footage await close-up references from the user.
- Keep original footage and personal reference photographs outside this public repository. Publish only assets used by the website.
- The user requested a complete editorial redesign below the film, using real project photographs, clean sans-serif typography and a guided WhatsApp inquiry. The approved temporary business WhatsApp destination is +49 176 30595942. Send only a prepared message into WhatsApp; never send it automatically.
- Optimized derivatives of the supplied Mercedes project photos and Tim's portrait are used on the website. Keep their original source files outside this repository. Do not invent additional projects, reviews, prices or certifications.

- Brand direction verified from Instagram on 2026-10-24: black backgrounds, champagne gold accents and silver typography. Preserve this palette and sans-serif typography.

- Tim inspects every car in person before quoting an individual price; no flat rates.
- Keep the hero as one continuous scroll journey without chapter buttons or chapter numbering. Smooth wheel/touch impulses without increasing the short scroll distance.
- Complete the film within the first 78% of the pinned distance and hold Tim before release. Keep footage below the fixed header and fill the frame without side bars. Desktop uses cover with vertical position 20%; mobile uses a full-height portrait crop with smooth subject tracking (Tim at 42% horizontal position). Keep the head and polisher visible and place final mobile text below the face.
- Use inline SVG for arrows and decorative icons; Unicode arrows can render as colorful emoji on iOS. Keep SVG icons aria-hidden with meaningful text or button labels.
- Encode public scroll video as H.264 High, yuv420p, avc1, with faststart and frequent keyframes. Never publish yuv444p/High 4:4:4 Intra for the mobile film. Keep inline muted playback and touch-triggered decoder priming for Safari.

- Hero controller lives in `hero.js`; other interactions live in `app.js`. Keep them independent so a media failure cannot disable navigation or inquiry.
- Displays <=600px use `assets/mobile-sequence/` (211 WebP frames, 12 fps, native 720x900) through a canvas, independent of autoplay permissions. Keep no more than 12 decoded images in memory; prioritize the requested frame and stop speculative requests while offscreen/hidden. Desktop retains the compatible H.264 video with a stalled-seek fallback to stills.
- Mobile crop follows [60,55,26,26,48,42,42] at progress [0,.185,.351,.55,.672,.88,.97], keeping the polisher in view; synchronize generated crops and hero.js.
- Use local WOFF2 fonts; quality.css holds readability, touch, small-screen and media refinements. Preserve 16px form fields on mobile. Check overflow at 320px and the header at tablet widths.
- The user confirmed on 2026-10-25 that business address and email are not available yet. Do not fabricate legal or contact details.
