export interface Branch {
  id: string;
  abbreviation: string;
  name: string;
  domain: 'cs-it' | 'ece-eee' | 'mech-civil' | 'other';
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    glow: string;
    badgeBg: string; // for pill badge
    iconColor: string;
  };
  verificationLink: string;
  officialLink: string;
  description: string;
  representativeIcon: string; // keyword for our custom canvas or SVG icon
}

export interface InfoCard {
  title: string;
  description: string;
  icon: string;
}
