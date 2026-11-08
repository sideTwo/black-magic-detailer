// All treatment films are silent web exports; the paint view is a comparison.
(() => {
const ceramicComparison = {
  knowledge: 'wissen-keramik', title: 'Regen zeigt den Unterschied.', label: 'Ohne / Mit',
  video: 'assets/garage/keramik-regenvergleich-frontal-v2-1080p.mp4',
  poster: 'assets/garage/keramik-regenvergleich-frontal-v1.webp', loop: false, fixedComparison: true, compareAt: .18,
  description: 'Links bleibt Wasser als flacher Film auf der unversiegelten Fläche liegen. Rechts bildet es auf der versiegelten Hälfte feine Perlen. Die feste Mittellinie trennt beide Ansichten. KI-Visualisierung mit ergänzter Regensimulation, kein dokumentierter Kundentest.'
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
      { ...ceramicComparison, label: 'Keramik' }
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
    continuous: true,
    description: 'Vom Fahrzeug bis ins Lederdetail. Eine ruhige Kamerafahrt führt zur schonenden Bürstenreinigung.',
    steps: [{ title: 'Sanfte Kreise. Sorgfältige Reinigung.', label: 'Leder', video: 'assets/garage/leder-gesamt-v19-4k.mp4', loop: false, poster: 'assets/garage/leder-gesamt-v19-4k.webp', description: 'Eine weiche Bürste arbeitet den Reinigungsschaum mit langsamen kreisenden Bewegungen ein. Material und Zustand bestimmen die passende Reinigung und Pflege. KI-Visualisierung der Lederaufbereitung.' }]
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
    continuous: true,
    description: 'Von der Garage zur Motorhaube. Erlebe, wie Regen auf unversiegeltem und versiegeltem Lack wirkt.',
    steps: [{ ...ceramicComparison, video: 'assets/garage/keramik-frontal-regen-gesamt-v2-1080p.mp4', poster: 'assets/garage/keramik-frontal-regen-gesamt-v1.webp', compareAt: 6.18 }]
  }
};
})();
