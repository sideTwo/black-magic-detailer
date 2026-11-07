// All treatment films are silent web exports; the paint view is a comparison.
(() => {
const ceramicComparison = {
  knowledge: 'wissen-keramik', title: 'Wasserfilm oder feine Perlen.', label: 'Ohne / Mit',
  video: null, poster: 'assets/garage/keramik-vergleich-mit-v2.webp',
  before: 'assets/garage/keramik-vergleich-ohne-v1.webp', after: 'assets/garage/keramik-vergleich-mit-v2.webp',
  beforeLabel: 'OHNE VERSIEGELUNG', afterLabel: 'MIT VERSIEGELUNG', zoom: 1.8,
  beforeAlt: 'KI-Visualisierung: Nahaufnahme der glatten weißen Motorhaube mit flächig benetzendem Wasser ohne Versiegelung',
  afterAlt: 'KI-Visualisierung: dieselbe Motorhaube mit feinen Wasserperlen auf versiegeltem Lack',
  comparisonLabel: 'Wasser auf Lack ohne und mit Versiegelung vergleichen',
  description: 'Ziehe die Trennlinie: Links verteilt sich Wasser flächiger, rechts bildet es feine Perlen. Der Lack bleibt auf beiden Seiten glatt und glänzend. KI-Visualisierung des Benetzungsverhaltens, kein dokumentierter Kundentest.'
};
window.BMD_GARAGE = {
  polish: {
    knowledge: 'wissen-politur',
    title: 'Polieren', eyebrow: 'LACKAUFBEREITUNG', service: 'Lackaufbereitung',
    approach: 'assets/garage/politur-anfahrt-final-kandidat-v2-4k.mp4',
    description: 'Vom ersten Polierzug bis zur klaren Reflexion. Entdecke die Arbeit am Lack und das Finish danach.',
    steps: [
      { title: 'Die Politur', label: 'Polieren', video: 'assets/garage/politur-behandlung-final-v3-4k.mp4', poster: 'assets/garage/politur-behandlung-final-v3-4k.webp', description: 'Feine Schleifkörper gleichen leichte Defekte in der obersten Lackschicht aus. So werden Reflexionen wieder klarer; tiefe Kratzer lassen sich nicht beliebig auspolieren.' },
      { title: 'Gleiches Licht. Klareres Lackbild.', label: 'Lackbild', video: null, poster: 'assets/garage/lack-nachher-v3.webp', before: 'assets/garage/lack-vorher-v3.webp', after: 'assets/garage/lack-nachher-v3.webp', description: 'KI-Visualisierung unter gleicher Prüfleuchte: Feine Waschkratzer streuen das Licht um den Lichtpunkt. Nach der Korrektur zeigt der glatte Klarlack ruhigere, klarere Reflexionen. Ziehe den Regler für den Vergleich. Kein dokumentiertes Kundenergebnis.' },
      { ...ceramicComparison, label: 'Keramik' },
      { knowledge: 'wissen-keramik', title: 'Wasser perlt. Und läuft ab.', label: 'Abperlen', video: 'assets/garage/keramik-abperlen-final-kandidat-v3-4k.mp4', poster: 'assets/garage/keramik-abperlen-v3-4k.webp', description: 'Die wasserabweisende Oberfläche lässt Tropfen zu Perlen werden. Bei ausreichender Neigung und Tropfengröße laufen sie ab. Die regelmäßige Wäsche bleibt Teil der Pflege.' }
    ]
  },
  wheels: {
    knowledge: 'wissen-felgen',
    title: 'Felgen', eyebrow: 'FELGENREINIGUNG', service: 'Felgenreinigung',
    description: 'Sorgfalt bis ins Detail. Vom Felgenreiniger über die Arbeit mit der Bürste bis zum sauberen Ergebnis.',
    approach: 'assets/garage/felgen-anfahrt-final-kandidat-v1-4k.mp4',
    steps: [{ title: 'Schmutz lösen. Glanz freilegen.', label: 'Felgen', video: 'assets/garage/felgen-ablauf-final-v5-4k.mp4', poster: 'assets/garage/felgen-ablauf-final-v5-4k.webp', description: 'Reaktive Reiniger können sich bei Kontakt mit eisenhaltigen Partikeln violett färben. Eine weiche Bürste unterstützt das Lösen; Abspülen entfernt die Rückstände. Die Einwirkzeit ist im Film verkürzt.' }]
  },
  leather: {
    knowledge: 'wissen-leder',
    title: 'Leder', eyebrow: 'LEDERAUFBEREITUNG', service: 'Lederaufbereitung',
    approach: 'assets/garage/leder-anfahrt-nutzer-v7-1080p.mp4',
    description: 'Aktueller Entwurf der Anfahrt zur Lederaufbereitung.',
    steps: [{ title: 'Kreisende Bürstenreinigung · Entwurf.', label: 'Leder', video: 'assets/garage/leder-buerste-kreise-kandidat-v8-1080p.mp4', loop: false, poster: 'assets/garage/leder-buerste-kreise-kandidat-v8.webp', description: 'Neue stumme Kling-Aufnahme zur Sichtprüfung: Eine weiche Bürste bewegt sich in kleinen kreisenden Bahnen über das Leder und verteilt Reinigungsschaum. Die enge Fassung zeigt Handschuh und Bürste; der Unterarm bleibt außerhalb des Bildes. Noch kein freigegebenes Endergebnis.' }]
  },
  cargo: {
    knowledge: 'wissen-innenraum',
    title: 'Kofferraum', eyebrow: 'INNENREINIGUNG', service: 'Innenraumaufbereitung',
    approach: 'assets/garage/heck-kamerafahrt-final-v4-4k.mp4',
    description: 'Vom offenen Heck bis in die Teppichfasern. Sorgfältige Innenreinigung, passend zu Material und Zustand.',
    steps: [{ title: 'Sauber bis ins Muster.', label: 'Reinigung & Bürstenmuster', video: 'assets/garage/kofferraum-reinigung-buerste-final-v3-4k.mp4', poster: 'assets/garage/kofferraum-reinigung-buerste-final-v3-4k.webp', description: 'Zuerst werden lose Partikel abgesaugt. Anschließend legt eine Teppichbürste den sauberen Flor in unterschiedliche Richtungen. So wirken benachbarte Bahnen heller oder dunkler. Welche weiteren Reinigungsschritte nötig sind, entscheidet Tim nach dem Zustand der Materialien.' }]
  },
  wash: {
    knowledge: 'wissen-waesche',
    title: 'Außenwäsche', eyebrow: 'SNOW FOAM', service: 'Außenwäsche',
    approach: 'assets/garage/waesche-kamerafahrt-final-v2-4k.mp4',
    description: 'Der Anfang eines guten Finishs. Gründliche Vorreinigung und eine schonende Wäsche des Fahrzeugs.',
    steps: [{ title: 'Schaum auftragen. Gründlich abspülen.', label: 'Snow Foam', video: 'assets/garage/waesche-behandlung-final-v3-4k.mp4', poster: 'assets/garage/waesche-behandlung-final-v3-4k.webp', description: 'Tenside helfen, fettigen Straßenfilm anzulösen. Der Schaum hält den Reiniger auf der Fläche; abgespült werden Reiniger und gelöster Schmutz. Die Einwirkzeit ist verkürzt dargestellt; danach folgt die Handwäsche.' }]
  },
  ceramic: {
    knowledge: 'wissen-keramik',
    title: 'Keramik', eyebrow: 'KERAMIKVERSIEGELUNG', service: 'Keramikversiegelung',
    approach: 'assets/garage/keramik-kamerafahrt-final-v3-4k.mp4',
    description: 'Ein Finish, das die Pflege leichter macht. Erlebe den Abperleffekt im Detail.',
    steps: [ceramicComparison, { title: 'Wasser perlt. Und läuft ab.', label: 'Abperlen', video: 'assets/garage/keramik-abperlen-final-kandidat-v3-4k.mp4', poster: 'assets/garage/keramik-abperlen-v3-4k.webp', description: 'Wasser benetzt die beschichtete Fläche schlechter und bildet Perlen. Ob sie ablaufen, hängt unter anderem von Neigung und Tropfengröße ab. Die passende Versiegelung bespricht Tim bei der Besichtigung.' }]
  }
};
})();
