# Black Magic Detailer

Website-Entwurf für Tim Rupprecht, Mannheim / Rhein-Neckar.

Statische Website mit einer scrollgesteuerten BMW-, Motorhauben-, Politur- und Wasserperlen-Sequenz sowie einem Abschlussbild von Tim. Die Scrollstrecke bleibt bei 1,8 Bildschirmhöhen auf Desktop und 1,6 auf Mobilgeräten. Läuft ohne Build-Schritt direkt auf GitHub Pages.

Der Bereich unter dem Film zeigt ein echtes Mercedes-Benz-190-E-Projekt mit sieben Bildern in einer Galerie, Vorher/Nachher-Details, auswählbaren Leistungen und Tims Originalporträt. Film und Keramikmotiv sind KI-Visualisierungen; Projektfotos und Porträt sind Originalaufnahmen.

Die Anfrage führt in drei Schritten durch Fahrzeug, Wünsche und Nachrichtenvorschau. Sie öffnet WhatsApp mit einem vorbereiteten Text an die vom Auftraggeber angegebene Nummer +49 176 30595942. Es werden keine Formulardaten auf einem Server gespeichert und keine Nachrichten automatisch gesendet. Die Anfrage reserviert keinen Termin. Die Nummer steht in `app.js` und den direkten WhatsApp-Links in `index.html`.

Tim trägt im filmischen Abschlussbild schwarze Handschuhe und steht nahe am vorderen Rad. Die letzte brauchbare Rückfahrt aus dem bestätigten Clip wird durch einen kurzen Lichtübergang eingebunden; das Schlussbild stammt aus dem scharfen Original. Die Korrektur der Tattoos im Politur-Clip wartet noch auf Referenzbilder.

## Entwicklung

`index.html`, `styles.css`, `editorial.css`, `quality.css`, `hero.js`, `app.js` und `media-config.js` liegen direkt im Projektstamm. `styles.css` enthält die Basis des Filmeinstiegs; `editorial.css` gestaltet den neuen Projekt-, Leistungs- und Kontaktbereich. Medien liegen in `assets/`. Manrope und Barlow Condensed werden lokal geladen; ihre Lizenztexte liegen in `assets/fonts/`.

Die Galerie unterstützt Pfeiltasten und Escape, die Leistungsauswahl ebenfalls Pfeiltasten. Animationen berücksichtigen `prefers-reduced-motion`. Das Formular ist ohne JavaScript über einen direkten WhatsApp-Link erreichbar.

GitHub Pages: Branch `main`, Ordner `/`.


## Medien und Qualität

Auf schmalen Displays bis 600 px zeichnet `hero.js` dieselbe Fahrt aus 211 WebP-Einzelbildern auf eine Canvas. Die Portraitsequenz benötigt insgesamt 3,79 MB statt 14,99 MB Video. Angefragte Bilder haben Vorrang; höchstens zwölf Bilder bleiben dekodiert im Cache. Die Poliermaschine bleibt im mobilen Ausschnitt sichtbar. Auf größeren Displays wird das H.264-Video (High, yuv420p, faststart) verwendet; bei Decoderfehlern oder ausbleibenden Seek-Antworten bleiben die Standbilder als Rückfallebene erhalten. Die kurze Scrollstrecke und der abschließende Halt bleiben unverändert.

Bei reduzierter Bewegung wird kein Film/keine Bildfolge geladen. Ein Wechsel der Systemeinstellung lädt die Seite nicht neu und erhält Formulareingaben. Schriftdateien werden lokal als WOFF2 geladen. Bildabmessungen sind im HTML angegeben; Inhalte unterhalb des Einstiegs laden ihre Bilder verzögert.

Geprüft: schmale Ansichten ab 320 px, mobile Fahrt vorwärts/rückwärts und Schlussbild, Desktop-Video, Menüfokus, Galerie per Tastatur, Vergleichsregler, Leistungs-Tabs und Formular einschließlich WhatsApp-URL ohne Versand. Die Browserprüfung ersetzt keinen Test auf einem physischen iPhone. Geschäftsanschrift und E-Mail für die vollständigen Firmen-/Rechtstexte wurden noch nicht geliefert; es werden keine Daten erfunden.
`node tests/hero.test.cjs` prüft reduzierte Bewegung, Offline-Rückfall, blockierte Video-Seeks, Medienwechsel und das Endbild bei schnellem Scrollen.
