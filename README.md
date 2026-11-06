# Black Magic Detailer

Neuer Website-Aufbau vom 6. November 2026 für Tim Rupprecht. Statische HTML/CSS/JavaScript-Seite ohne Build-Schritt. GitHub Pages veröffentlicht `main` aus dem Stammverzeichnis.

## Aktive Startseite

- `index.html`, `rebuild.css` und `rebuild.js` bilden die neue Garage, die Inhaltsbereiche und die Anfrage.
- Vollständiges breites Garagenmotiv `tim-garage-v16-wide.webp`, 1915 × 821 Pixel. Keine künstlich verschwommenen Seiten, keine Randmasken. Das Motiv ist kein natives 4K-Bild.
- Sechs Kategorien sind über Bildmarkierungen und ein separates Menü erreichbar. Auf kleinen Displays ersetzt das Menü die Bildmarkierungen, damit die Ziele gut antippbar bleiben.
- Die Filmansicht füllt auf Desktop die verfügbare Breite mit proportionalem `cover`; dadurch kann etwas von der Bildhöhe entfallen. Mobile zeigt das vollständige 16:9-Bild. Das beseitigt keine bereits in Quelldateien enthaltenen Fehler.
- Unter „Polieren“ gibt es zusätzlich den Lackbildvergleich mit Maus-, Touch- und Tastaturbedienung. Keramik öffnet einen Film, keinen Bildslider.
- `fullscreen.js` und `fullscreen.css` erhalten die dezente Vollbildfunktion für das gesamte Dokument, auch bei geöffnetem Film.

## Filmstand — noch keine abgeschlossene Neuproduktion

Die vorhandenen Medien aus `garage-media.js` werden ausdrücklich als Vorschau verwendet. In dieser Überarbeitung wurden **keine neuen Kling-Videos erzeugt und keine Kling-Credits ausgegeben**.

| Bereich | Aktuell eingebunden | Offene Neuproduktion |
| --- | --- | --- |
| Felgen | Vorhandene Reinigung | Stationäre, runde Räder; seitliche Kamera bis parallel zum Rad, dann Nahaufnahme |
| Außenwäsche | Vorhandene Anfahrt und Behandlung | Neuer durchgehender Haubenablauf nach dem aktuellen Auftrag |
| Polieren | Vorhandene Nahaufnahme und Lackvergleich | Korrekte Anfahrt und unauffälliger Behandlungsloop |
| Leder | Nur die aktuelle Bildvorlage mit sichtbarem Hinweis | Vollständige Fahrt um das stehende Auto, linke Fahrertür, gleichzeitiger Eintritt zum festen Sitz, rechter Handeintritt und kreisendes Bürsten |
| Kofferraum | Vorhandene Heckfahrt, Saugen und echtes Bürstenmuster | Neue konsistente Kamerafahrt und Reinigung nach dem aktuellen Auftrag |
| Keramik | Vorhandener Abperlfilm | Animierte geteilte Fläche: links unversiegelt, rechts versiegelt, realistisch ablaufende Tropfen |

Die verworfenen Lederfilme und die fehlerhaften Felgen-/Politur-Anfahrten werden nicht erneut aktiviert. Die Filmhinweise benennen den Vorschaucharakter. Auch die aktuellen Vorlagen ersetzen keine geometrisch stabile Fahrzeugaufnahme.

Filme starten bei Auswahl stumm, ohne native Player-Bedienelemente. Eine verfügbare Anfahrt läuft einmal, danach nur die Behandlung als Loop. Der nachfolgende Film wird vorbereitet, während die Anfahrt läuft; das ausgehende Bild bleibt stehen, bis der nächste Film tatsächlich spielt. Beim Schließen und beim Wechsel werden Quellen und Ereignisse freigegeben. Bei reduzierter Bewegung entfällt die Kamerafahrt. Wiedergabesperren und Ladefehler bieten eine Start-/Retry-Aktion.

Neue Render sind zurzeit durch die automatische Browser-Freigabeprüfung blockiert: fehlende Workspace-Credits. Das ist keine Prüfung des Kling-Guthabens. Kein alternativer Browserzugriff und keine neuen Käufe. Nächste Render laut aktuellem Auftrag: **1080p, ohne Ton**, Originalfotos als verbindliche Referenzen. Keine Behauptung nativer 4K/60-fps-Neuproduktion.

## Inhalte und Kontakt

Schwarz-Gold, lokale Manrope-Schrift, skalierbares SVG-Logo, Originalporträt und Projektfoto. Sechs aufklappbare Erklärungen erläutern die allgemeinen Wirkprinzipien der Reinigung und verlinken die Quellen. Sie sind keine unbestätigte Liste der von Tim eingesetzten Produkte.

Das Formular öffnet einen vorbereiteten WhatsApp-Text an `+49 176 30595942`. Es sendet nichts automatisch und speichert keine Formulardaten auf einem Server. Umfang und Preis folgen nach Fahrzeugbesichtigung. Geschäftsanschrift und geschäftliche E-Mail fehlen weiterhin; die Seite ist als Vorschau gekennzeichnet.

Originalfotos, Prompts, Generationen und Budgetprotokolle bleiben im übergeordneten privaten Arbeitsordner. Frühere Seiten und Dateien bleiben zur Nachvollziehbarkeit erhalten, werden von der neuen Startseite aber nicht geladen.

## Prüfung

`node tests/garage.test.cjs` prüft die sechs Zugänge, Medienpfade, Wiedergabefolge, Quellenfreigabe, verworfene Kandidaten, Vergleich, Retry und WhatsApp-Entwurf ohne Browser. Zusätzlich `node --check rebuild.js`, `node --check fullscreen.js` und `git diff --check` ausführen. Diese Prüfungen ersetzen keine reale Browser-Sichtprüfung; diese ist aktuell durch die genannte Freigabeprüfung blockiert.
