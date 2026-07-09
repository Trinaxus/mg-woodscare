/**
 * Zentraler Content für MG Woodscare.
 * Wird im Admin bearbeitet und als JSON exportiert/importiert.
 * Später leicht an eine externe Server-API zu binden.
 */

export interface SiteContent {
  brand: {
    name: string;
    accentName: string;
    tagline: string;
    location: string;
  };
  background: {
    pattern?: string;
    opacity?: number;
    color?: string;
  };
  hairline: {
    color?: string;
    opacity?: number;
    thickness?: number;
  };
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  stats: { value: string; label: string }[];
  leistungen: {
    sectionTitle: string;
    sectionText: string;
    items: { icon: string; title: string; text: string }[];
  };
  ueberUns: {
    title: string;
    intro: string;
    intro2: string;
    badges: string[];
    certLabel: string;
    certSub: string;
    team: { name: string; role: string; image?: string; bullets: string[] }[];
  };
  features: {
    sawmill: { eyebrow: string; title: string; text: string };
    firewood: { eyebrow: string; title: string; text: string };
  };
  referenzen: {
    title: string;
    items: { title: string; text: string }[];
  };
  kontakt: {
    title: string;
    text: string;
    phone: string;
    email: string;
    address: string;
    ownerLine: string;
    processTitle: string;
    processSteps: { number: string; title: string; text: string }[];
  };
  instagram: {
    handle: string;
    url: string;
    label: string;
    postCount: number;
    selectedPostIds: string[];
  };
  impressum: {
    company: string;
    owner: string;
    street: string;
    city: string;
    phone: string;
    email: string;
    register: string;
    registerCourt: string;
    registerNumber: string;
    vatId: string;
    haftungInhalte: string;
    haftungLinks: string;
    urheberrecht: string;
  };
  datenschutz: {
    intro: string;
    verantwortlich: string;
    serverLog: string;
    kontaktformular: string;
    cookies: string;
    rechte: string;
    kontaktStelle: string;
  };
}

export const defaultContent: SiteContent = {
  brand: {
    name: "MG",
    accentName: "Woodscare",
    tagline: "Baumpflegedienst · Leipzig",
    location: "Leipzig & Umland, Sachsen",
  },
  background: {
    pattern: "",
    opacity: 0.08,
    color: "",
  },
  hairline: {
    color: "",
    opacity: 1,
    thickness: 0.5,
  },
  hero: {
    eyebrow: "Baumpflegedienst · Sägewerk · Leipzig",
    titleLead: "Wir sind",
    titleAccent: "eins",
    titleTail: "mit der Natur.",
    subtitle:
      "MG Woodscare steht für professionelle Baumpflege, sichere Fällarbeiten und ein regionales Sägewerk mit Trockenkammer – im Herzen von Leipzig.",
    ctaPrimary: "Unsere Leistungen",
    ctaSecondary: "Kostenloses Angebot",
  },
  stats: [
    { value: "15+", label: "Jahre Erfahrung" },
    { value: "2.500+", label: "gepflegte Bäume" },
    { value: "100%", label: "regionales Holz" },
    { value: "24 / 7", label: "Notdienst" },
  ],
  leistungen: {
    sectionTitle: "Vom Wipfel bis zur Bohle – alles aus einer Hand.",
    sectionText:
      "Baumpflege, Fällarbeiten und Holzverarbeitung greifen bei uns ineinander. So bleibt der Baum bis zum letzten Meter wertgeschätzt.",
    items: [
      {
        icon: "TreeDeciduous",
        title: "Problembaumfällung & Baumpflege",
        text: "Kronenpflege, Erziehungsschnitt und schonende Fällungen – auch bei engen Platzverhältnissen und in unmittelbarer Nähe zu Gebäuden.",
      },
      {
        icon: "Axe",
        title: "Baumkletterarbeiten (SKT)",
        text: "Seilklettertechnik SKT-A/B für Arbeiten in luftiger Höhe. Sicher, präzise und materialschonend.",
      },
      {
        icon: "Sprout",
        title: "Wurzelfräsung",
        text: "Rückstandsfreie Beseitigung von Baumstümpfen bis in die Tiefe. Anschließend nutzbar als Rasen- oder Beetfläche.",
      },
      {
        icon: "Leaf",
        title: "Obstbaumverschnitt & Lehrgänge",
        text: "Fachgerechter Obstbaumschnitt sowie praktische und theoretische Lehrgänge in Obstbau und Veredlung.",
      },
      {
        icon: "ShieldCheck",
        title: "Baumkontrolle nach FLL",
        text: "Verkehrssicherung, Gutachten und akute Gefahrenabwehr für Kommunen, Betriebe und Privatkunden.",
      },
      {
        icon: "Warehouse",
        title: "Sägewerk & Trockenkammer",
        text: "Vom Stamm zur maßgenauen Bohle. Wir schneiden nach Ihren Vorgaben und trocknen technisch auf Zielfeuchte.",
      },
      {
        icon: "Flame",
        title: "Kaminholz",
        text: "Ofenfertiges Brennholz aus regionalen Laubhölzern – trocken gelagert, sauber gespalten, in Ihrer Wunschlänge.",
      },
      {
        icon: "Horse",
        title: "Arbeiten mit Rückepferden",
        text: "Boden- und bestandsschonender Holzrückung mit Pferd – über 20 Jahre Erfahrung im waldökologisch sensiblen Einsatz.",
      },
    ],
  },
  ueberUns: {
    title: "Handwerk mit Wurzeln in Sachsen.",
    intro:
      "Seit vielen Jahren sind wir in und um Leipzig für Privatkunden, Kommunen und Betriebe im Einsatz. Unser Team verbindet klassisches Forsthandwerk mit moderner Seilklettertechnik und dem Anspruch, Bäume so lange wie möglich zu erhalten.",
    intro2:
      "Fällt ein Baum doch, endet seine Geschichte nicht: Über unser eigenes Sägewerk mit Trockenkammer verwandeln wir Stämme in wertvolle Bohlen, Bretter und Kaminholz.",
    badges: [
      "Seilklettertechnik SKT-A/B",
      "Baumkontrolle nach FLL",
      "Eigenes Sägewerk in Leipzig",
      "Regional & nachhaltig",
    ],
    certLabel: "FLL-zertifiziert",
    certSub: "Fachagrarwirt Baumpflege",
    team: [
      {
        name: "H. Merkel",
        role: "Geschäftsführer",
        bullets: [
          "Management",
          "SKT Ausbildung",
          "Dozent an der Volkshochschule",
          "Obstbaumverschnitt in praktischer Ausführung",
          "Module 1–6",
        ],
      },
      {
        name: "K. Grützner",
        role: "Management & Logistik",
        bullets: ["Management", "Logistik & Einsatzplanung"],
      },
      {
        name: "R. Heyne",
        role: "Baumkontrolleur",
        bullets: ["SKT Ausbildung", "FLL Baumkontrolleur", "Module 1 / 2 / 3 / 5"],
      },
      {
        name: "P. Köthe",
        role: "Forstwirt & Rückepferde",
        bullets: [
          "Über 20 Jahre Erfahrung in der Forstwirtschaft",
          "Spezialist für Arbeiten mit Rückepferden im Wald",
        ],
      },
      {
        name: "J. Thiele",
        role: "Obstbaum-Dozent",
        bullets: [
          "Dozent für Obstbaumverschnitt-Lehrgänge",
          "Praktische & theoretische Ausbildung",
          "Obstbau & Obstbaumveredlung",
        ],
      },
      {
        name: "T. Ressel",
        role: "Kettensägen-Ausbilder",
        bullets: [
          "SKT Ausbildung",
          "Ausbilder und Dozent an der Kettensäge",
          "Module 1–6",
        ],
      },
    ],
  },
  features: {
    sawmill: {
      eyebrow: "Sägewerk & Trockenkammer",
      title: "Regionales Holz, präzise verarbeitet.",
      text: "Vom Stammschnitt über die technische Trocknung bis zum Endmaß – transparente Prozesse für Handwerker, Architekten und Bauherren.",
    },
    firewood: {
      eyebrow: "Brennholz",
      title: "Kaminholz aus dem Leipziger Umland.",
      text: "Ofenfertig getrocknet, sortenrein und in Ihrer Wunschlänge. Lieferung frei Haus in der Region Leipzig.",
    },
  },
  referenzen: {
    title: "Vertrauen aus Stadt, Gewerbe und Nachbarschaft.",
    items: [
      { title: "Stadt Leipzig", text: "Regelmäßige Baumkontrollen und Pflegeschnitte im öffentlichen Grün." },
      { title: "Wohnungsgenossenschaften", text: "Verkehrssicherung großer Baumbestände in Innenhöfen und an Wegen." },
      { title: "Privatgärten", text: "Von der jungen Obstbaumerziehung bis zur schonenden Altbaumsanierung." },
      { title: "Zimmereien & Tischler", text: "Individueller Zuschnitt aus regionalen Hölzern über unser Sägewerk." },
    ],
  },
  kontakt: {
    title: "Sprechen wir über Ihren Baum.",
    text: "Ob akute Gefahr, geplante Pflege oder ein individueller Holzzuschnitt – wir melden uns in der Regel innerhalb von 24 Stunden zurück.",
    phone: "0178 4158214",
    email: "hmerkel01@googlemail.com",
    address: "Heckenweg 16, 04349 Leipzig",
    ownerLine: "Heiko Merkel · Baumpflegedienst",
    processTitle: "So arbeiten wir mit Ihnen zusammen",
    processSteps: [
      { number: "01", title: "Anfrage", text: "Sie schildern uns die Situation, per Telefon, E-Mail oder über das Formular unten." },
      { number: "02", title: "Vor-Ort-Termin", text: "Wir schauen uns Baum und Gelände gemeinsam an und beraten ehrlich, ob überhaupt etwas nötig ist." },
      { number: "03", title: "Festes Angebot", text: "Sie bekommen eine klare Aussage zu Aufwand, Ablauf und Preis, ohne versteckte Posten." },
      { number: "04", title: "Durchführung", text: "Fachgerecht und sicher, mit dem passenden Verfahren: Seiltechnik, Maschine oder Rückepferd." },
      { number: "05", title: "Nachsorge", text: "Fläche aufgeräumt, Holz nach Wunsch verwertet oder als Kaminholz mitgenommen. Fertig." },
    ],
  },
  instagram: {
    handle: "@mg_woodscare_baumpflegedienst_",
    url: "https://www.instagram.com/mg_woodscare_baumpflegedienst_",
    label: "Aktuelle Baustellen auf Instagram",
    postCount: 6,
    selectedPostIds: [],
  },
  impressum: {
    company: "MG Woodscare – Baumpflegedienst",
    owner: "Heiko Merkel",
    street: "Heckenweg 16",
    city: "04349 Leipzig",
    phone: "0178 4158214",
    email: "hmerkel01@googlemail.com",
    register: "Eintragung im Handelsregister.",
    registerCourt: "Leipzig",
    registerNumber: "45-23564",
    vatId: "DE49738274",
    haftungInhalte:
      "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.",
    haftungLinks:
      "Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.",
    urheberrecht:
      "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.",
  },
  datenschutz: {
    intro:
      "Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In diesen Datenschutzinformationen informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website.",
    verantwortlich:
      "Verantwortlich für die Datenverarbeitung ist Heiko Merkel, Heckenweg 16, 04349 Leipzig. Bei Fragen zum Datenschutz erreichen Sie uns unter hmerkel01@googlemail.com.",
    serverLog:
      "Beim Besuch unserer Website werden automatisch Informationen (Server-Logfiles) erfasst: Browsertyp/-version, verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners sowie Uhrzeit der Serveranfrage. Diese Daten sind nicht bestimmten Personen zuordenbar und werden ausschließlich zur statistischen Auswertung und zum Betrieb der Website verwendet.",
    kontaktformular:
      "Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, werden Ihre Angaben zwecks Bearbeitung der Anfrage sowie für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
    cookies:
      "Unsere Website verwendet nur technisch notwendige Cookies, um die Grundfunktionen der Seite bereitzustellen. Es findet kein Tracking durch Drittanbieter statt.",
    rechte:
      "Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt, können Sie sich bei uns oder der zuständigen Aufsichtsbehörde beschweren.",
    kontaktStelle:
      "Datenschutzanfragen richten Sie bitte an: Heiko Merkel, hmerkel01@googlemail.com, Telefon 0178 4158214.",
  },
};
