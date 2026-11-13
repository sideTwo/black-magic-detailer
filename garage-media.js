// All treatment films are silent web exports; the paint view is a comparison.
(() => {
const ceramicComparison = {
  knowledge: 'wissen-keramik', title: 'Wasser trifft auf. Perlen rollen ab.', label: 'Abperlen',
  video: 'assets/garage/keramik-makro-v8-kling-4k.mp4', loop: false,
  poster: 'assets/garage/keramik-makro-v8-kling-4k.webp',
  description: 'Die Makroaufnahme zeigt Wasserperlen auf glattem, versiegeltem Lack. Tropfen verbinden sich und bewegen sich über die geneigte Oberfläche. KI-Visualisierung des Benetzungsverhaltens.'
};
window.BMD_GARAGE = {
  polish: {
    knowledge: 'wissen-politur',
    title: 'Polieren', eyebrow: 'LACKAUFBEREITUNG', service: 'Lackaufbereitung',
    continuous: true,
    description: 'Vom ersten Polierzug bis zur klaren Reflexion. Entdecke die Arbeit am Lack und das Finish danach.',
    steps: [
      { title: 'Die Politur', label: 'Polieren', video: 'assets/garage/politur-gesamt-v6-smooth-4k.mp4', loop: false, poster: 'assets/garage/tim-garage-filmkonsistent-v22-4k.webp', description: 'Die Maschine wird in überlappenden Bahnen über die Haube geführt. Feine Schleifkörper gleichen leichte Defekte in der obersten Lackschicht aus. So werden Reflexionen wieder klarer; tiefe Kratzer lassen sich nicht beliebig auspolieren.' },
      { title: 'Gleiches Licht. Klareres Lackbild.', label: 'Lackbild', video: null, poster: 'assets/garage/lack-nachher-v3.webp', before: 'assets/garage/lack-vorher-v3.webp', after: 'assets/garage/lack-nachher-v3.webp', description: 'KI-Visualisierung unter gleicher Prüfleuchte: Feine Waschkratzer streuen das Licht um den Lichtpunkt. Nach der Korrektur zeigt der glatte Klarlack ruhigere, klarere Reflexionen. Ziehe den Regler für den Vergleich. Kein dokumentiertes Kundenergebnis.' },
      { ...ceramicComparison, label: 'Keramik' }
    ]
  },
  wheels: {
    knowledge: 'wissen-felgen',
    title: 'Felgen', eyebrow: 'FELGENREINIGUNG', service: 'Felgenreinigung',
    description: 'Sorgfalt bis ins Detail. Vom Felgenreiniger über die Arbeit mit der Bürste bis zum sauberen Ergebnis.',
    approach: 'assets/garage/felgen-anfahrt-final-kandidat-v1-4k.mp4',
    steps: [{ title: 'Schmutz lösen. Glanz freilegen.', label: 'Felgen', video: 'assets/garage/felgen-ablauf-v8-farbabgleich-4k.mp4', loop: false, poster: 'assets/garage/felgen-ablauf-v8-farbabgleich.webp', description: 'Reaktive Reiniger können sich bei Kontakt mit eisenhaltigen Partikeln violett färben. Eine weiche Bürste unterstützt das Lösen; Abspülen entfernt die Rückstände. Die Einwirkzeit ist im Film verkürzt. KI-Visualisierung der Felgenreinigung.' }]
  },
  leather: {
    knowledge: 'wissen-leder',
    title: 'Leder', eyebrow: 'LEDERAUFBEREITUNG', service: 'Lederaufbereitung',
    continuous: true,
    description: 'Vom Einstieg bis zur Sitzfläche. Entdecke die Reinigung mit weicher Bürste und kreisenden Bewegungen.',
    steps: [
      { title: 'Weiche Bürste. Kreisende Reinigung.', label: 'Beifahrer', video: 'assets/garage/leder-beifahrer-gesamt-v35-soft-1080p.mp4', loop: false, poster: 'assets/garage/leder-beifahrer-schritt-zurueck-v2.webp', description: 'Tim macht Platz. Durch die geöffnete Beifahrertür geht es zur Sitzfläche: Eine weiche Bürste arbeitet den Reinigungsschaum in kreisenden Bewegungen ein. KI-Visualisierung der Lederpflege.' },
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
    continuous: true,
    description: 'Vom Kotflügel in die nahe Makroaufnahme: Wasser trifft auf glatten Lack und bildet sichtbare Perlen.',
    steps: [{ ...ceramicComparison, video: 'assets/garage/keramik-gesamt-makro-v9-smooth-4k.mp4', poster: 'assets/garage/tim-garage-filmkonsistent-v22-4k.webp' }]
  }
};
})();
