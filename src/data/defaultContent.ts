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
    eyebrow: "",
    titleLead: "",
    titleAccent: "",
    titleTail: "",
    subtitle: "",
    ctaPrimary: "",
    ctaSecondary: "",
  },
  stats: [],
  leistungen: {
    sectionTitle: "",
    sectionText: "",
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
    title: "",
    items: [],
  },
  kontakt: {
    title: "",
    text: "",
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
};
