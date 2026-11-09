// All treatment films are silent web exports; the paint view is a comparison.
(() => {
const ceramicComparison = {
  knowledge: 'wissen-keramik', title: 'Glatter Lack. Wasser perlt ab.', label: 'Abperlen',
  video: 'assets/garage/keramik-abperlen-final-v4-4k.mp4',
  poster: 'assets/garage/keramik-abperlen-glatt-v4.webp',
  description: 'Die frühere Aufnahme mit glattem, glänzendem Lack: Wasser bildet Perlen und läuft bei ausreichender Neigung und Tropfengröße ab. KI-Visualisierung des Abperleffekts.'
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
    description: 'Zwei vorhandene Kamerafahrten im Vergleich: über die Beifahrertür oder über die Fahrertür bis zur Lederreinigung.',
    steps: [
      { title: 'Tim tritt zurück. Die Tür öffnet sich.', label: 'Beifahrer', video: 'assets/garage/leder-beifahrer-schritt-zurueck-v2-1080p.mp4', loop: false, poster: 'assets/garage/leder-beifahrer-schritt-zurueck-v2.webp', description: 'Die frühere Aufnahme zum Vergleich: Tim macht Platz, die Tür schwingt nach außen und die Kamera fährt zur Sitzfläche. Anschließend folgt die dazugehörige Bürstenaufnahme. Vorhandene KI-Visualisierung in 1080p.' },
      { title: 'Die bisherige Fahrt zur Fahrerseite.', label: 'Fahrer (bisher)', video: 'assets/garage/leder-gesamt-v19-4k.mp4', loop: false, poster: 'assets/garage/leder-gesamt-v19-4k.webp', description: 'Die bisherige Gesamtfassung bleibt zum direkten Vergleich erhalten: Kamerafahrt zur Fahrertür, Annäherung an die Sitzfläche und Reinigung mit langsamen kreisenden Bürstenbewegungen. KI-Visualisierung der Lederaufbereitung.' }
    ]
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
    description: 'Die frühere Kamerafahrt zum glatten, spiegelnden Lack und der Abperleffekt im Detail.',
    steps: [ceramicComparison]
  }
};
})();
