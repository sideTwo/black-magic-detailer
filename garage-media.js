// All treatment films are silent web exports; the paint view is a comparison.
(() => {
const ceramicComparison = {
  knowledge: 'wissen-keramik', title: 'Regen trifft auf. Wasser perlt ab.', label: 'Abperlen',
  video: 'assets/garage/keramik-regen-v3-1080p.mp4', loop: false,
  poster: 'assets/garage/keramik-regen-v3.webp',
  description: 'Auf glattem, versiegeltem Lack bildet Regen kleine Wasserperlen. Tropfen verbinden sich; größere Tropfen laufen über die geneigte Fläche ab. KI-Visualisierung des Benetzungsverhaltens.'
};
window.BMD_GARAGE = {
  polish: {
    knowledge: 'wissen-politur',
    title: 'Polieren', eyebrow: 'LACKAUFBEREITUNG', service: 'Lackaufbereitung',
    approach: 'assets/garage/stance/polieren-stance-v1-4k.mp4',
    description: 'Vom ersten Polierzug bis zur klaren Reflexion. Entdecke die Arbeit am Lack und das Finish danach.',
    steps: [
      { title: 'Die Politur', label: 'Polieren', video: 'assets/garage/politur-behandlung-weiter-v4-1080p.mp4', loop: false, poster: 'assets/garage/politur-behandlung-weiter-v4.webp', description: 'Die Maschine wird in überlappenden Bahnen über die Haube geführt. Feine Schleifkörper gleichen leichte Defekte in der obersten Lackschicht aus. So werden Reflexionen wieder klarer; tiefe Kratzer lassen sich nicht beliebig auspolieren.' },
      { title: 'Gleiches Licht. Klareres Lackbild.', label: 'Lackbild', video: null, poster: 'assets/garage/lack-nachher-v3.webp', before: 'assets/garage/lack-vorher-v3.webp', after: 'assets/garage/lack-nachher-v3.webp', description: 'KI-Visualisierung unter gleicher Prüfleuchte: Feine Waschkratzer streuen das Licht um den Lichtpunkt. Nach der Korrektur zeigt der glatte Klarlack ruhigere, klarere Reflexionen. Ziehe den Regler für den Vergleich. Kein dokumentiertes Kundenergebnis.' },
      { ...ceramicComparison, label: 'Keramik' }
    ]
  },
  wheels: {
    knowledge: 'wissen-felgen',
    title: 'Felgen', eyebrow: 'FELGENREINIGUNG', service: 'Felgenreinigung',
    description: 'Sorgfalt bis ins Detail. Vom Felgenreiniger über die Arbeit mit der Bürste bis zum sauberen Ergebnis.',
    approach: 'assets/garage/stance/felgen-stance-v1-4k.mp4',
    steps: [{ title: 'Schmutz lösen. Glanz freilegen.', label: 'Felgen', video: 'assets/garage/felgen-ablauf-final-v5-4k.mp4', poster: 'assets/garage/felgen-ablauf-final-v5-4k.webp', description: 'Reaktive Reiniger können sich bei Kontakt mit eisenhaltigen Partikeln violett färben. Eine weiche Bürste unterstützt das Lösen; Abspülen entfernt die Rückstände. Die Einwirkzeit ist im Film verkürzt.' }]
  },
  leather: {
    knowledge: 'wissen-leder',
    title: 'Leder', eyebrow: 'LEDERAUFBEREITUNG', service: 'Lederaufbereitung',
    continuous: true,
    description: 'Vom Einstieg bis zur Sitzfläche. Entdecke die Reinigung mit weicher Bürste und Mikrofasertuch.',
    steps: [
      { title: 'Sanft bürsten. Sorgfältig nachwischen.', label: 'Beifahrer', video: 'assets/garage/leder-beifahrer-pflege-v24-4k.mp4', loop: false, poster: 'assets/garage/stance/leder-beifahrer-stance-v1.webp', description: 'Tim macht Platz. Durch die geöffnete Beifahrertür geht es zur Sitzfläche: Eine weiche Bürste arbeitet den Reinigungsschaum in kreisenden Bewegungen ein, danach nimmt ein Mikrofasertuch ihn auf. KI-Visualisierung der Lederpflege.' },
      { title: 'Die bisherige Fahrt zur Fahrerseite.', label: 'Fahrer (bisher)', video: 'assets/garage/stance/leder-fahrer-stance-v1-4k.mp4', loop: false, poster: 'assets/garage/stance/leder-fahrer-stance-v1.webp', description: 'Die bisherige Gesamtfassung bleibt zum direkten Vergleich erhalten: Kamerafahrt zur Fahrertür, Annäherung an die Sitzfläche und Reinigung mit langsamen kreisenden Bürstenbewegungen. KI-Visualisierung der Lederaufbereitung.' }
    ]
  },
  cargo: {
    knowledge: 'wissen-innenraum',
    title: 'Kofferraum', eyebrow: 'INNENREINIGUNG', service: 'Innenraumaufbereitung',
    approach: 'assets/garage/stance/kofferraum-stance-v1-4k.mp4',
    description: 'Vom offenen Heck bis in die Teppichfasern. Sorgfältige Innenreinigung, passend zu Material und Zustand.',
    steps: [{ title: 'Sauber bis ins Muster.', label: 'Reinigung & Bürstenmuster', video: 'assets/garage/kofferraum-reinigung-buerste-final-v3-4k.mp4', poster: 'assets/garage/kofferraum-reinigung-buerste-final-v3-4k.webp', description: 'Zuerst werden lose Partikel abgesaugt. Anschließend legt eine Teppichbürste den sauberen Flor in unterschiedliche Richtungen. So wirken benachbarte Bahnen heller oder dunkler. Welche weiteren Reinigungsschritte nötig sind, entscheidet Tim nach dem Zustand der Materialien.' }]
  },
  wash: {
    knowledge: 'wissen-waesche',
    title: 'Außenwäsche', eyebrow: 'SNOW FOAM', service: 'Außenwäsche',
    approach: 'assets/garage/stance/waesche-stance-v1-4k.mp4',
    description: 'Der Anfang eines guten Finishs. Gründliche Vorreinigung und eine schonende Wäsche des Fahrzeugs.',
    steps: [{ title: 'Schaum auftragen. Gründlich abspülen.', label: 'Snow Foam', video: 'assets/garage/waesche-behandlung-final-v3-4k.mp4', poster: 'assets/garage/waesche-behandlung-final-v3-4k.webp', description: 'Tenside helfen, fettigen Straßenfilm anzulösen. Der Schaum hält den Reiniger auf der Fläche; abgespült werden Reiniger und gelöster Schmutz. Die Einwirkzeit ist verkürzt dargestellt; danach folgt die Handwäsche.' }]
  },
  ceramic: {
    knowledge: 'wissen-keramik',
    title: 'Keramik', eyebrow: 'KERAMIKVERSIEGELUNG', service: 'Keramikversiegelung',
    continuous: true,
    description: 'Vom Kotflügel zum glatten Lack: Regen bildet Wasserperlen, die zusammenwachsen und ablaufen.',
    steps: [{ ...ceramicComparison, video: 'assets/garage/stance/keramik-stance-v1-1080p.mp4', poster: 'assets/garage/stance/keramik-stance-v1.webp' }]
  }
};
})();
