# Black Magic Detailer

Website-Entwurf für Tim Rupprecht, Mannheim / Rhein-Neckar. Statische Website ohne Build-Schritt, veröffentlicht über GitHub Pages (main, Stammverzeichnis).

## Interaktive Garage

Das frühere Endbild von Tim neben dem BMW ist nun der Einstieg. Bereiche am Fahrzeug und das darunterliegende Menü öffnen einzelne Filme: Polieren, Felgen, Leder, Außenwäsche und Keramik. Die Startseite scrollt normal; Videos laufen nach dem Anklicken in Echtzeit. Es gibt keine Scroll-Steuerung und keinen festgehaltenen Filmabschnitt.

`garage-media.js` enthält die Filme und Beschreibungen. Unter Polieren lassen sich Politur, Lackbild und Keramik wählen. `garage.js` steuert die Bildmarkierungen und den modalen Player. `garage.css` enthält die Gestaltung.

Die vorhandene Politur und das Wasserperlen-Video werden als H.264 High/yuv420p, avc1, faststart abgespielt. Dateien werden erst bei Auswahl geladen; beim Schließen und Wechseln wird die Quelle freigegeben. Inline-Wiedergabe, native Video-Steuerung, Wiederholen, Fehlerhinweis und erneutes Laden werden unterstützt.

Noch zu liefern: Artlist-Filme für Felgen, Leder und Snow Foam. Die zugehörigen Startbilder sind anhand der neu gelieferten Originalfotos erstellt: silberne Felgen, blaue Bremssättel und cognacfarbenes Leder. Der Lackbild-Vergleich ist mit zwei abgestimmten KI-Bildern bereits eingebunden. Die noch fehlenden Filme sind offen als noch folgend markiert. Eine komplette Anleitung mit Bild- und Video-Prompts liegt im übergeordneten Projektordner in `ARTLIST-GARAGE-CLIPS.txt`.

Die alte Scroll-Implementierung und ihre Medien bleiben in der Versionsgeschichte und vorerst im Repository, werden vom aktuellen HTML jedoch nicht mehr eingebunden oder geladen.

## Weitere Inhalte und Anfrage

Echtes Mercedes-Benz-190-E-Projekt mit Galerie und Vorher/Nachher-Regler, Leistungen, Originalporträt und geführte Anfrage. `app.js` steuert diese Bereiche. Die Anfrage öffnet WhatsApp mit vorbereitetem Text an die vom Auftraggeber angegebene Nummer +49 176 30595942. Es werden keine Nachrichten automatisch gesendet oder Formulardaten auf einem Server gespeichert. Tim besichtigt das Fahrzeug persönlich, bevor er einen individuellen Preis nennt.

Garage und Filme sind KI-Visualisierungen, Projektfotos und Porträt Originalaufnahmen. Geschäftliche Anschrift und E-Mail für die vollständigen Firmenangaben fehlen noch.

Manrope und Barlow Condensed werden als lokale WOFF2-Dateien geladen, ihre Lizenzen liegen in assets/fonts. Farbwelt: Schwarz, Champagnergold und Silber. Pfeile sind SVG.

Aktuelle Integrationsprüfungen: `node tests/garage.test.cjs`. Vor Veröffentlichung zusätzlich Desktop-/Handy-Vorschau, Videowiedergabe, Schließen und Übernahme der Leistung ins Formular prüfen.

Die fertigen 1600x900-PNGs, ein ZIP und die Video-Prompts liegen im übergeordneten Ordner `Artlist Startbilder`. Webdateien liegen unter `assets/garage`. Das Garage-Startbild wurde auf die tatsächlichen silbernen Felgen korrigiert; Tims Pose und Gesicht bleiben am freigegebenen Motiv orientiert.
