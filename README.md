# Black Magic Detailer

Website-Entwurf für Tim Rupprecht, Mannheim / Rhein-Neckar.

Statische Website mit einer scrollgesteuerten BMW-, Motorhauben-, Politur- und Wasserperlen-Sequenz sowie einem Abschlussbild von Tim. Die Scrollstrecke bleibt bei 1,8 Bildschirmhöhen auf Desktop und 1,6 auf Mobilgeräten. Läuft ohne Build-Schritt direkt auf GitHub Pages.

Der Bereich unter dem Film zeigt ein echtes Mercedes-Benz-190-E-Projekt mit sieben Bildern in einer Galerie, Vorher/Nachher-Details, auswählbaren Leistungen und Tims Originalporträt. Film und Keramikmotiv sind KI-Visualisierungen; Projektfotos und Porträt sind Originalaufnahmen.

Die Anfrage führt in drei Schritten durch Fahrzeug, Wünsche und Nachrichtenvorschau. Sie öffnet WhatsApp mit einem vorbereiteten Text an die vom Auftraggeber angegebene Nummer +49 176 30595942. Es werden keine Formulardaten auf einem Server gespeichert und keine Nachrichten automatisch gesendet. Die Anfrage reserviert keinen Termin. Die Nummer steht in `app.js` und den direkten WhatsApp-Links in `index.html`.

Tim trägt im filmischen Abschlussbild schwarze Handschuhe und steht nahe am vorderen Rad. Ein überzeugender Rückfahrt-Clip zu Tim und die Korrektur der Tattoos im Politur-Clip stehen noch aus. Die beanstandeten Rückfahrt-Videos sind nicht eingebaut.

## Entwicklung

`index.html`, `styles.css`, `editorial.css`, `app.js` und `media-config.js` liegen direkt im Projektstamm. `styles.css` enthält die Basis des Filmeinstiegs; `editorial.css` gestaltet den neuen Projekt-, Leistungs- und Kontaktbereich. Medien liegen in `assets/`. Manrope und Barlow Condensed werden lokal geladen; ihre Lizenztexte liegen in `assets/fonts/`.

Die Galerie unterstützt Pfeiltasten und Escape, die Leistungsauswahl ebenfalls Pfeiltasten. Animationen berücksichtigen `prefers-reduced-motion`. Das Formular ist ohne JavaScript über einen direkten WhatsApp-Link erreichbar.

GitHub Pages: Branch `main`, Ordner `/`.

