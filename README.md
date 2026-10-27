# Black Magic Detailer

Website-Entwurf für Tim Rupprecht, Mannheim / Rhein-Neckar. Statische Website ohne Build-Schritt, veröffentlicht über GitHub Pages (main, Stammverzeichnis).

## Interaktive Garage

Das frühere Endbild von Tim neben dem BMW ist nun der Einstieg. Bereiche am Fahrzeug und das darunterliegende Menü öffnen einzelne Filme: Polieren, Felgen, Leder, Außenwäsche und Keramik. Die Startseite scrollt normal; Videos laufen nach dem Anklicken in Echtzeit. Es gibt keine Scroll-Steuerung und keinen festgehaltenen Filmabschnitt.

`garage-media.js` enthält die Filme und Beschreibungen. Unter Polieren lassen sich Politur, Lackbild und Keramik wählen. `garage.js` steuert die Bildmarkierungen und den modalen Player. `garage.css` enthält die Gestaltung.

Die vorhandene Politur und das Wasserperlen-Video werden als H.264 High/yuv420p, avc1, faststart abgespielt. Dateien werden erst bei Auswahl geladen; beim Schließen und Wechseln wird die Quelle freigegeben. Nach der Auswahl laufen die Filme automatisch stumm als Loop, ohne Player-Bedienelemente. Nur bei einer Wiedergabesperre erscheint eine Startmöglichkeit; Ladefehler lassen sich erneut versuchen.

Die Artlist-Nahaufnahmen für Leder und Snow Foam sowie die neuere Kling-Felgenreinigung sind eingebunden. Alle fünf Behandlungsfilme enthalten technisch keine Audiospur. Die auf Tims Originalfotos abgestimmten Motive zeigen silberne Felgen, blaue Bremssättel und cognacfarbenes Leder. Der Lackbild-Vergleich nutzt zwei abgestimmte KI-Bilder und einen ziehbaren Regler. Die Originale bleiben privat im übergeordneten Arbeitsordner.

Die alte Scroll-Implementierung und ihre Medien bleiben in der Versionsgeschichte und vorerst im Repository, werden vom aktuellen HTML jedoch nicht mehr eingebunden oder geladen.

## Weitere Inhalte und Anfrage

Echtes Mercedes-Benz-190-E-Projekt mit Galerie und Vorher/Nachher-Regler, Leistungen, Originalporträt und geführte Anfrage. `app.js` steuert diese Bereiche. Die Anfrage öffnet WhatsApp mit vorbereitetem Text an die vom Auftraggeber angegebene Nummer +49 176 30595942. Es werden keine Nachrichten automatisch gesendet oder Formulardaten auf einem Server gespeichert. Tim besichtigt das Fahrzeug persönlich, bevor er einen individuellen Preis nennt.

Garage und Filme sind KI-Visualisierungen, Projektfotos und Porträt Originalaufnahmen. Geschäftliche Anschrift und E-Mail für die vollständigen Firmenangaben fehlen noch.

Manrope und Barlow Condensed werden als lokale WOFF2-Dateien geladen, ihre Lizenzen liegen in assets/fonts. Farbwelt: Schwarz, Champagnergold und Silber. Pfeile sind SVG.

Aktuelle Integrationsprüfungen: `node tests/garage.test.cjs`. Vor Veröffentlichung zusätzlich Desktop-/Handy-Vorschau, Videowiedergabe, Schließen und Übernahme der Leistung ins Formular prüfen.

Die fertigen 1600x900-PNGs, ein ZIP und die Video-Prompts liegen im übergeordneten Ordner `Artlist Startbilder`. Webdateien liegen unter `assets/garage`. Das Garage-Startbild wurde auf die tatsächlichen silbernen Felgen korrigiert; Tims Pose und Gesicht bleiben am freigegebenen Motiv orientiert.

Beim Öffnen fährt die Ansicht aus dem aktuellen Garagenbild zum gewählten Bereich und blendet in den Film über. Die Kamerafahrt basiert auf dem Foto, dauert 1,35 Sekunden und entfällt bei reduzierter Bewegung. Felge, Leder, Politur und Wäsche verwenden neue Nahaufnahmen; sichtbare Unterarme wurden anhand von Tims Tattoo-Fotos angepasst. Die privaten Referenzfotos werden nicht veröffentlicht.

Für Felgen läuft auf dem Desktop eine 2,083 Sekunden lange generierte Kamerafahrt einmalig vor der Reinigung: erst die freigegebene Drehung zur Radfläche, dann der kurze gerade Nahzoom. Tim hält dabei durchgehend ein Mikrofasertuch. Der Nahzoom verbindet das tatsächliche letzte Bild der Drehung mit dem ersten Bild der Reinigung. Die Ansicht bleibt groß und mittig im Browser; sie wird nicht in ein seitliches Videofenster verkleinert. Anschließend wiederholt sich nur der stumme Reinigungsablauf: Reiniger auftragen, mit einer Bürste auf den Speichen einarbeiten, abspülen und das saubere Ergebnis zeigen. Die Einwirkzeit wird verkürzt dargestellt. Das Garagenbild passt zum neuen Startbild mit Tuch und Tims gelieferten Gesichtsreferenzen. Neue Webausgaben bleiben in 1920×1080 ohne Audiospur, das Kling-Wasserzeichen bleibt erhalten. Auf kleinen Bildschirmen und bei reduzierter Bewegung startet direkt der Behandlungsfilm. Die übrigen Kategorien behalten bis zu ihrer jeweiligen Video-Sichtprüfung den bisherigen Fotoübergang.

Der private vollständige Felgenfilm liegt als `Kling Kamerafahrten PC/felgen-pc-komplett-v8.mp4` außerhalb des Repositorys. Die Kamerafahrt wurde mit 60 Bildern pro Sekunde exportiert; der native Behandlungsloop bleibt separat, damit sich die Anfahrt nicht ständig wiederholt. Die Bewegung ist eine KI-generierte Filmsequenz, keine deterministisch steuerbare 3D-Szene.
