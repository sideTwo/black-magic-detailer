# Black Magic Detailer – Weiterarbeit ohne bisherigen Chat

Stand: 17.11.2026. Diese Datei und die aktuellen Quelldateien haben Vorrang vor älteren, teils überholten Einträgen in README/AGENTS. Die Website läuft ohne Verbindung zu einem ChatGPT-/Codex-Account. Nur für neue KI-Generierung wäre ein eigener Zugang zum jeweiligen Werkzeug nötig.

## Morgen übernehmen

1. Repository `https://github.com/sideTwo/black-magic-detailer` auf dem eigenen GitHub-Konto öffnen. Zum Weiterarbeiten mit Git klonen; „Code → Download ZIP“ enthält ebenfalls den aktuellen Quellstand samt Medien, aber keine Git-Historie.
2. Keine Medien über den bisherigen Chat herunterladen: Alle aktiven Bilder, Logos, Schriften und Videos liegen im Repository unter `assets/`. Es gibt keine Laufzeitabhängigkeit von KI-Diensten, CDNs oder Zugangsdaten aus diesem Account.
3. Lokal einen statischen HTTP-Server starten, z. B. im Repo `python -m http.server 4820`, anschließend `http://localhost:4820/` öffnen. Keine npm-Installation erforderlich.
4. Im neuen Coding-Chat dieses Repository und diese Übergabe als Grundlage nennen. Nicht den alten Remake-Ansatz oder historische Videoentwürfe wieder aktivieren.

Vorschau: https://sidetwo.github.io/black-magic-detailer/ . Der Zugriff auf GitHub selbst muss über das eigene Konto bzw. die vorhandene Repository-Berechtigung möglich sein; die Codex-Sitzung überträgt keine Anmeldedaten.

Bestätigte Kontakt-E-Mail (Bilal, 17.11.2026): `info@black-detailer-mannheim.de`. Diese Adresse steht im Kontakt, im FAQ-Mail-Link, im Impressum und im Datenschutz. Die bisherige web.de-Adresse nicht wieder einsetzen. Website-Domain und Hosting bleiben gesondert zu bestätigen.

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
| `datenschutz.html` | Hinweise für das tatsächliche GitHub-Pages-Hosting und den Kontaktablauf |
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

Zuletzt 26 Tests erfolgreich. Abschlussrunde am 17.11. im ChatGPT-Browser bei 1440 × 900 und 390 × 844 geprüft: Hero, Referenzvorschau, Lack-Originalpaare, Audi-Originalumschalter, Filme ab 0 und bis zum Ende/Zurück sowie mobile Anfrage bis zur vorbereiteten WhatsApp-Nachricht. Keine Nachricht versendet. Details und verbleibende Prüfgrenzen in AUDIT-2026-11-17.md. Ein physisches iPhone-/Androidgerät, Safari und eine gedrosselte Verbindung sind noch separat zu prüfen.

Für ein neues, **leeres** Ausgabeverzeichnis:

```sh
node scripts/build-pages.cjs --out ../black-magic-webpaket
```

Der Parameter lautet **`--out`**, nicht `--output`. Neue Dateien vor dem Paketbau mit Git vormerken: Der Helfer verwendet `git ls-files`. Das erzeugte Paket enthält die Website; alte unbenutzte Videos werden aus dem Paket ausgelassen, bleiben aber im Repository. Zur weiteren Bearbeitung das Repository verwenden, zum Übertragen auf einen statischen Hoster das erzeugte Paket.

Vor jedem Push `git fetch origin`, Stand vergleichen, nie Force-Push. Push auf `main` löst die vorhandene Pages-Pipeline aus. Keine Änderungen an Filmen allein wegen eines Layout-/Hinweiswunschs.

## Noch nicht live geschaltet / Entwürfe

- Abschlussrunde vom 17.11.: E-Mail im Impressum und Datenschutzseite ergänzt; Datenschutz im Footer und bei der Anfrage verlinkt. Keine bestätigten AV-Verträge oder pauschale Rechtsfreigabe behaupten. Vertragliche Hosting-/E-Mail-/Messenger-Konfiguration muss der Betreiber bestätigen.
- Die Hauptseite und beide Rechtstexte sind als Vorschau mit `noindex, follow` versehen. Keine `robots.txt`-Sperre davorlegen, sonst kann die Suchmaschine das noindex nicht lesen. Das ist keine Zugangssperre: Website und Repository bleiben öffentlich erreichbar.
- Vor dem echten Domain-Launch: Domain/DNS/HTTPS und tatsächliches Hosting bestätigen, Canonical/OG-URLs und Sitemap umstellen, Datenschutzhinweise dem Hoster anpassen und nur auf der freigegebenen Hauptseite die Vorschau-Indexierungssperre entfernen. Historische Prüfseiten bleiben noindex. Kein fertiges ALL-INKL-Livepaket behaupten.
- Kein Film wird mehr automatisch nach Seitenaufruf vorgeladen. `garage.js` bereitet erst bei Zeiger-/Tastaturabsicht vor; gepufferter Start bei 0 bleibt erhalten. Der Hauptbutton benennt WhatsApp vor Beginn der Anfrage.
- Bilal bestätigt am 17.11.: Besichtigung, Ablauf, Dauer, Termin, Abgabe und Abholung werden direkt mit Tim über WhatsApp besprochen. Die FAQ benennt diesen Weg ausdrücklich; keine pauschalen Zeiten, Kosten oder Werkstattadressen ergänzen. Die Impressumsadresse nicht ungeprüft als Werkstattadresse bewerben. Telefon und E-Mail bleiben Kontaktalternativen.

- Die beiden Dateien `assets/garage/keramik-vergleich-rechts-v1.webp` und `assets/garage/keramik-vergleich-rechts-versiegelt-v1-1080p.mp4` sind gesicherte, bisher unbenutzte Entwürfe. **Kein Auftrag, sie in den aktiven Keramikfilm einzubauen.**
- Weitere einzelne HTML-Prüfseiten im Repository sind historische Entwürfe, nicht die Hauptseite. Maßgeblich sind `index.html` und `garage-media.js`.
- Domainauftrag `black-magic-detailer.de`: KAS/DNS-Status noch klären. GitHub Pages ist die bestätigte Vorschau; kein abgeschlossener Domain-Launch behauptet.
- Kontaktablauf führt derzeit zu WhatsApp. Eine spätere Umstellung auf ein echtes Formular muss zum tatsächlichen Hoster passen; keine fertige PHP-Anbindung behaupten.
- Lokale Rohfotos, generierte PNG-Master, Prompts und das gemeinsame Obsidian-Brain liegen zusätzlich auf Bilals Rechner außerhalb dieses Repos. Diese Dateien bleiben nach dem Accountwechsel lokal verfügbar, sind aber nicht alle öffentlich hochgeladen. Die Website selbst ist vollständig aus dem Repository wiederherstellbar. Rohfotos mit Kennzeichen und Zugangsdaten nicht ins öffentliche Repository kopieren.
