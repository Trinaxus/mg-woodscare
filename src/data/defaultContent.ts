/**
 * Leerer Default-Content für MG Woodscare.
 * Alle Inhalte kommen über die Admin-Section / serverseitige API.
 * Diese Datei dient nur noch als Typ-Definition und Fallback-Struktur.
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
    image?: string;
  };
  stats: { value: string; label: string }[];
  leistungen: {
    sectionTitle: string;
    sectionText: string;
    image?: string;
    items: { icon: string; title: string; text: string }[];
  };
  ueberUns: {
    title: string;
    intro: string;
    intro2: string;
    badges: string[];
    certLabel: string;
    certSub: string;
    image?: string;
    team: { name: string; role: string; image?: string; bullets: string[] }[];
  };
  features: {
    sawmill: { eyebrow: string; title: string; text: string; image?: string };
    firewood: { eyebrow: string; title: string; text: string; image?: string };
  };
  referenzen: {
    title: string;
    image?: string;
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
    image?: string;
  };
  instagram: {
    handle: string;
    url: string;
    label: string;
    postCount: number;
    selectedPostIds: string[];
  };
  social: {
    facebook: string;
    instagram: string;
    whatsapp: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
  };
  reviews: {
    title: string;
    subtitle: string;
    items: {
      name: string;
      role: string;
      text: string;
      rating: number;
      source: 'google' | 'manual';
      image?: string;
      date?: string;
    }[];
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
    hosting: string;
    serverLog: string;
    kontaktformular: string;
    cookies: string;
    rechte: string;
    kontaktStelle: string;
  };
  home: {
    ueberUnsEyebrow: string;
    teamTitle: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaPrimaryLabel: string;
    ctaSecondaryLabel: string;
    ctaTertiaryLabel: string;
  };
  seo?: {
    homeDescription?: string;
    leistungenDescription?: string;
    leistungenKeywords?: string;
  };
  settings?: {
    googlePlaceId?: string;
    reviewsLastSynced?: string;
  };
}

export const defaultContent: SiteContent = {
  brand: {
    name: "",
    accentName: "",
    tagline: "",
    location: "",
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
    eyebrow: "Baumpflege & Sägewerk",
    titleLead: "Wir sind",
    titleAccent: "eins mit der Natur",
    titleTail: "",
    subtitle: "Professionelle Baumpflege, sichere Baumfällung und regionales Sägewerk mit Trockenkammer im Herzen von Leipzig.",
    ctaPrimary: "Leistungen",
    ctaSecondary: "Kontakt",
  },
  stats: [],
  leistungen: {
    sectionTitle: "Unsere Leistungen",
    sectionText: "Von der Baumpflege über das Sägewerk bis zur Trockenkammer – wir bieten alle Leistungen rund um den Baum.",
    items: [],
  },
  ueberUns: {
    title: "",
    intro: "",
    intro2: "",
    badges: [],
    certLabel: "",
    certSub: "",
    team: [],
  },
  features: {
    sawmill: { eyebrow: "", title: "", text: "" },
    firewood: { eyebrow: "", title: "", text: "" },
  },
  referenzen: {
    title: "Referenzen",
    items: [],
  },
  kontakt: {
    title: "Kontakt",
    text: "Rufen Sie uns an oder schreiben Sie uns – wir beraten Sie gerne zu Ihrem Baumvorhaben.",
    phone: "",
    email: "",
    address: "",
    ownerLine: "",
    processTitle: "",
    processSteps: [],
  },
  instagram: {
    handle: "",
    url: "",
    label: "",
    postCount: 0,
    selectedPostIds: [],
  },
  social: {
    facebook: "https://www.facebook.com/share/17rZc8gQf9/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/mg_woodscare_baumpflegedienst_",
    whatsapp: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
  },
  reviews: {
    title: "Das sagen unsere Kunden",
    subtitle: "Echte Bewertungen aus Google und von zufriedenen Kunden",
    items: [],
  },
  impressum: {
    company: "",
    owner: "",
    street: "",
    city: "",
    phone: "",
    email: "",
    register: "",
    registerCourt: "",
    registerNumber: "",
    vatId: "",
    haftungInhalte: "",
    haftungLinks: "",
    urheberrecht: "",
  },
  datenschutz: {
    intro: "",
    verantwortlich: "",
    hosting: "",
    serverLog: "",
    kontaktformular: "",
    cookies: "",
    rechte: "",
    kontaktStelle: "",
  },
  home: {
    ueberUnsEyebrow: "",
    teamTitle: "",
    ctaTitle: "",
    ctaSubtitle: "",
    ctaPrimaryLabel: "",
    ctaSecondaryLabel: "",
    ctaTertiaryLabel: "",
  },
  seo: {
    homeDescription: "",
    leistungenDescription: "",
    leistungenKeywords: "",
  },
  settings: {
    googlePlaceId: "",
    reviewsLastSynced: "",
  },
};
