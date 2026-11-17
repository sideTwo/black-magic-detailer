# Black Magic Detailer – Weiterarbeit ohne bisherigen Chat

Stand: 17.11.2026. Diese Datei und die aktuellen Quelldateien haben Vorrang vor älteren, teils überholten Einträgen in README/AGENTS. Die Website läuft ohne Verbindung zu einem ChatGPT-/Codex-Account. Nur für neue KI-Generierung wäre ein eigener Zugang zum jeweiligen Werkzeug nötig.

## Morgen übernehmen

1. Repository `https://github.com/sideTwo/black-magic-detailer` auf dem eigenen GitHub-Konto öffnen. Zum Weiterarbeiten mit Git klonen; „Code → Download ZIP“ enthält ebenfalls den aktuellen Quellstand samt Medien, aber keine Git-Historie.
2. Keine Medien über den bisherigen Chat herunterladen: Alle aktiven Bilder, Logos, Schriften und Videos liegen im Repository unter `assets/`. Es gibt keine Laufzeitabhängigkeit von KI-Diensten, CDNs oder Zugangsdaten aus diesem Account.
3. Lokal einen statischen HTTP-Server starten, z. B. im Repo `python -m http.server 4820`, anschließend `http://localhost:4820/` öffnen. Keine npm-Installation erforderlich.
4. Im neuen Coding-Chat dieses Repository und diese Übergabe als Grundlage nennen. Nicht den alten Remake-Ansatz oder historische Videoentwürfe wieder aktivieren.

Vorschau: https://sidetwo.github.io/black-magic-detailer/ . Der Zugriff auf GitHub selbst muss über das eigene Konto bzw. die vorhandene Repository-Berechtigung möglich sein; die Codex-Sitzung überträgt keine Anmeldedaten.

## Maßgebliche Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Hauptseite, Referenzkarten, Inhalte, Leistungen, Kontakt |
| `app.js` | Projektgalerien, echte Vergleichspaare, Originalumschalter, Anfrage |
| `studio.css` | Layout unter der Garage, Referenzkacheln und Galerien |
| `garage-media.js` | Aktive sechs Filmabläufe und Lackbild-Vergleich |
| `garage-mobile.js` | Passende kleinere Videoquellen, auch auf Desktop verwendet |
| `garage.js`, `video-start.js`, `garage.css` | Garagenlayout, Hotspots und gepufferter Videostart ab Sekunde 0 |
| `services.js`, `services.css` | Auswahl der neun Leistungen |
| `impressum.html` | Impressum und Bildhinweise |
| `scripts/build-pages.cjs` | Website-Paket mit erforderlichen Medien erstellen |
| `.github/workflows/pages.yml` | Tests, Website-Paket und GitHub-Pages-Veröffentlichung bei Push auf main |

## Aktuell bestätigter Stand

- Hyundai ist auf Bilals Wunsch aus Referenzkarten und aktiver Galerie entfernt. Alte Bilddateien bleiben als Quellen erhalten.
- Referenzen: BMW (4), Audi TT (3 Polierschritte + 2 Innenraumfotos), Mercedes-Benz (3), Škoda (2), Lackkorrektur (2 Originalpaare), zusätzlich Mercedes-Benz 190 E (2 Einzelbilder + 2 Originalpaare).
- **Audi ist kein binäres Vorher/Nachher:** drei dokumentierte Polieraufnahmen, mit Originalfoto-Umschalter. Keine unbelegten Namen wie Grobschliff/Finish vergeben.
- Vier echte Originalpaare: Mercedes-Heckstoßstange Gesamtansicht und Detail sowie Mercedes 190 E Innenraum und Tankmulde. Unterschiedliche Aufnahmewinkel sind benannt. Nicht durch KI-Nachherbilder ersetzen.
- BMW-Beifahrerfußraum mit M-Einstiegsleiste gehört zu BMW. Leasingrückgabe verwendet das eindeutig erkennbare Mercedes-Cockpit. Keine Hyundai-/Škoda-Kofferräume vermischen.
- Vergleichsvorschau: verschachtelte Bilder brauchen explizit `width:100%;height:100%;object-fit:cover`, sonst erscheinen natürliche Bildgrößen als übergroßer Ausschnitt.
- KI-Hinweise auf ausdrücklichen Wunsch reduziert. Kurze lesbare Kennzeichnungen bleiben bei Garage/Filmen, künstlichen Lack-/Tankvergleichen und Symbolmotiven. Ausführliche Angaben unter `impressum.html#bildhinweise`, Footer nur Link. Fotobadges und große Erklärbox nicht wieder einbauen.
- Hero und Filmstart müssen dieselbe Bildfläche/Beschneidung behalten. Aktiver Hero V23; keine seitlichen Blur-/Maskenflächen und keine zusätzlichen Zooms beim Anklicken.
- Auto und Sitz bleiben stehen; Filme sind stumm. Bestehende akzeptierte Medien nicht ohne konkreten Auftrag neu generieren. Keine Käufe/Abos/Credit-Aufladungen.
- Videos starten über `video-start.js` erst nach sichtbarem Anfangsbild, Puffer und fertigem Übergang. Außenwäsche/Felgen/Kofferraum jeweils ein durchgehender Film, kein fehleranfälliger zweiter Player beim Behandlungsbeginn.
- Desktop-Pins: Polieren 0.56/0.485; Keramik 0.615/0.53; Leder 0.405/0.415; Wäsche 0.80/0.54; Felge 0.505/0.711; Kofferraum 0.14/0.45. Separate mobile Koordinaten in HTML erhalten, Trefferflächen nicht zusammenrücken.
- Typografie beibehalten: Manrope; Barlow Condensed für Garage. Kein erneutes Komplett-Remake.

## Prüfen und veröffentlichen

Mit vorhandenem Node.js:

```sh
node --test --test-isolation=none tests/gallery.test.cjs tests/garage.test.cjs tests/mobile-media.test.cjs tests/services.test.cjs tests/video-start.test.cjs
```

Zuletzt 26 Tests erfolgreich. Zusätzlich Browser bei 1440 und 390 px prüfen. Insbesondere Referenzvorschau, echte Bildpaare, Audi-Originalumschalter, alle Filme ab 0, Ende/Zurück und Kontaktvorauswahl.

Für ein neues, **leeres** Ausgabeverzeichnis:

```sh
node scripts/build-pages.cjs --out ../black-magic-webpaket
```

Der Parameter lautet **`--out`**, nicht `--output`. Neue Dateien vor dem Paketbau mit Git vormerken: Der Helfer verwendet `git ls-files`. Das erzeugte Paket enthält die Website; alte unbenutzte Videos werden aus dem Paket ausgelassen, bleiben aber im Repository. Zur weiteren Bearbeitung das Repository verwenden, zum Übertragen auf einen statischen Hoster das erzeugte Paket.

Vor jedem Push `git fetch origin`, Stand vergleichen, nie Force-Push. Push auf `main` löst die vorhandene Pages-Pipeline aus. Keine Änderungen an Filmen allein wegen eines Layout-/Hinweiswunschs.

## Noch nicht live geschaltet / Entwürfe

- Die beiden Dateien `assets/garage/keramik-vergleich-rechts-v1.webp` und `assets/garage/keramik-vergleich-rechts-versiegelt-v1-1080p.mp4` sind gesicherte, bisher unbenutzte Entwürfe. **Kein Auftrag, sie in den aktiven Keramikfilm einzubauen.**
- Weitere einzelne HTML-Prüfseiten im Repository sind historische Entwürfe, nicht die Hauptseite. Maßgeblich sind `index.html` und `garage-media.js`.
- Domainauftrag `black-magic-detailer.de`: KAS/DNS-Status noch klären. GitHub Pages ist die bestätigte Vorschau; kein abgeschlossener Domain-Launch behauptet.
- Kontaktablauf führt derzeit zu WhatsApp. Eine spätere Umstellung auf ein echtes Formular muss zum tatsächlichen Hoster passen; keine fertige PHP-Anbindung behaupten.
- Lokale Rohfotos, generierte PNG-Master, Prompts und das gemeinsame Obsidian-Brain liegen zusätzlich auf Bilals Rechner außerhalb dieses Repos. Diese Dateien bleiben nach dem Accountwechsel lokal verfügbar, sind aber nicht alle öffentlich hochgeladen. Die Website selbst ist vollständig aus dem Repository wiederherstellbar. Rohfotos mit Kennzeichen und Zugangsdaten nicht ins öffentliche Repository kopieren.
