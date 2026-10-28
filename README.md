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

Der Inhaltsbereich folgt den für Websites passenden Grundlagen der vom Auftraggeber gewählten [Apple Design Skill](https://github.com/dickwu/apple-design-skill): klare Hierarchie, lesbare Texte, vertraute Bedienelemente und zurückhaltende Bewegung. `studio.css` gestaltet die Bereiche nach der Garage mit größeren Originalfotos, zwei direkt erreichbaren Galerieansichten, 17px Fließtext, klarer Leistungswahl und einem dunklen Anfrageformular. Native iOS-Navigation wird nicht imitiert. Der übergroße dekorative Footer-Schriftzug und nicht benötigte Abschnittsnummern sind entfernt. Vergleich, Galerie, Formularvorauswahl und Garage bleiben erhalten. Layout wurde bis 320px sowie mit 200 Prozent Grundschriftgröße geprüft.

Garage und Filme sind KI-Visualisierungen, Projektfotos und Porträt Originalaufnahmen. Geschäftliche Anschrift und E-Mail für die vollständigen Firmenangaben fehlen noch.

Manrope und Barlow Condensed werden als lokale WOFF2-Dateien geladen, ihre Lizenzen liegen in assets/fonts. Farbwelt: Schwarz, Champagnergold und Silber. Pfeile sind SVG.

Aktuelle Integrationsprüfungen: `node tests/garage.test.cjs`. Vor Veröffentlichung zusätzlich Desktop-/Handy-Vorschau, Videowiedergabe, Schließen und Übernahme der Leistung ins Formular prüfen.

Die fertigen 1600x900-PNGs, ein ZIP und die Video-Prompts liegen im übergeordneten Ordner `Artlist Startbilder`. Webdateien liegen unter `assets/garage`. Das Garage-Startbild wurde auf die tatsächlichen silbernen Felgen korrigiert; Tims Pose und Gesicht bleiben am freigegebenen Motiv orientiert.

Bei Kategorien ohne eigene Film-Anfahrt fährt die Ansicht aus dem aktuellen Garagenbild zum gewählten Bereich und blendet in den Film über. Dieser Fotoübergang dauert 1,35 Sekunden und entfällt bei reduzierter Bewegung. Felge, Leder, Politur und Wäsche verwenden neue Nahaufnahmen; sichtbare Unterarme wurden anhand von Tims Tattoo-Fotos angepasst. Die privaten Referenzfotos werden nicht veröffentlicht.

Für Felgen läuft auf dem Desktop eine 2,083 Sekunden lange generierte Kamerafahrt einmalig vor der Reinigung: erst die freigegebene Drehung zur Radfläche, dann der kurze gerade Nahzoom. Tim hält dabei durchgehend ein Mikrofasertuch. Der Nahzoom verbindet das tatsächliche letzte Bild der Drehung mit dem ersten Bild der Reinigung. Die Ansicht bleibt groß und mittig im Browser; sie wird nicht in ein seitliches Videofenster verkleinert. Anschließend wiederholt sich nur der stumme Reinigungsablauf: Reiniger auftragen, mit einer Bürste auf den Speichen einarbeiten, abspülen und das saubere Ergebnis zeigen. Die Einwirkzeit wird verkürzt dargestellt. Das gemeinsame Garagenbild ist die von Bilal freigegebene V11 mit natürlichen Ganzkörperproportionen. Die bereits akzeptierte Felgenfahrt bleibt unverändert und beginnt noch mit der vorherigen Pose. Neue Webausgaben bleiben in 1920×1080 ohne Audiospur, das Kling-Wasserzeichen bleibt erhalten. Auf kleinen Bildschirmen und bei reduzierter Bewegung startet direkt der Behandlungsfilm. Außenwäsche behält bis zu ihrer Video-Sichtprüfung den bisherigen Fotoübergang.

Der private vollständige Felgenfilm liegt als `Kling Kamerafahrten PC/felgen-pc-komplett-v8.mp4` außerhalb des Repositorys. Die Kamerafahrt wurde mit 60 Bildern pro Sekunde exportiert; der native Behandlungsloop bleibt separat, damit sich die Anfahrt nicht ständig wiederholt. Die Bewegung ist eine KI-generierte Filmsequenz, keine deterministisch steuerbare 3D-Szene.

Auch Leder nutzt auf dem Desktop eine eigene kurze Kamerafahrt: Tim tritt mit seinem Tuch aus dem Türbereich, die Fahrertür öffnet sich nach außen und die Kamera fährt durch die freie Öffnung zum cognacfarbenen Fahrersitz. Die Türfahrt und der Sitz-Nahzoom bleiben jetzt in ihrem ursprünglichen Tempo: etwa fünf plus drei Sekunden, danach beginnt die vorhandene Lederpflege. Diese ist jetzt aus ihrem höher aufgelösten Original als stumme 1920×1080-Webdatei exportiert. Die Türfahrt wiederholt sich nur bei erneutem Öffnen der Kategorie; anschließend läuft ausschließlich die Pflege als Loop ohne Player-Bedienelemente. Originalfotos bestimmen die Innenraumfarbe und Sitzform. Die private zusammenhängende Sichtfassung und Prompts liegen unter `Kling Kamerafahrten PC/leder-pc-komplett-v3.mp4` beziehungsweise `LEDER-V2-PROMPT.txt`. Mobile Filme und weitere Kategorien werden erst nach der jeweiligen Desktop-Sichtprüfung fortgesetzt.

Die vorhandene Politur-Nahaufnahme wird aus dem 1080p-Original als stumme 1920×1080-Datei abgespielt. Der neue generierte Anflug zur Motorhaube läuft einmalig für fünf Sekunden vor der Politur. Die eigentliche Kamerabewegung bekommt mehr Zeit, Anfang und Ende bleiben kurz. Anschließend wiederholt sich nur die vorhandene Politur. Lackbild und Wasserperlen bleiben getrennt auswählbar.

Keramik öffnet auf dem Desktop mit einer eigenen fünfsekündigen Kamerafahrt im Originaltempo: vom freigegebenen Garagenbild über die Motorhaube bis zur trockenen Lack-Nahaufnahme. Darauf folgt das unveränderte Wasserperlen-Video als Loop. Die Anfahrt ist stumm in 1920×1080, der vorhandene Loop bleibt in seiner ursprünglichen 1600×900-Auflösung. Wie bei den anderen Kamera-Anfahrten werden Handyansichten und reduzierte Bewegung berücksichtigt. Die private zusammenhängende Sichtfassung heißt `Kling Kamerafahrten PC/keramik-pc-komplett-v1.mp4`.
