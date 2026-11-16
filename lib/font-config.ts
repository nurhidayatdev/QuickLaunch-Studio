export interface FontOption {
  id: string;
  name: string;
  category: string;
  className: string;
  description: string;
  sample: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "inter",
    name: "Inter",
    category: "Modern SaaS",
    className: "font-inter",
    description: "Sangat jernih, profesional, standar emas antarmuka teknologi modern.",
    sample: "Aa Bb 123",
  },
  {
    id: "jakarta",
    name: "Plus Jakarta",
    category: "Tech & Startup",
    className: "font-jakarta",
    description: "Karakter geometris berwibawa, populer untuk webinar, tech event & agensi.",
    sample: "Aa Bb 123",
  },
  {
    id: "poppins",
    name: "Poppins",
    category: "Friendly & UMKM",
    className: "font-poppins",
    description: "Hangat, ramah, dan bulat. Sangat pas untuk kuliner, fesyen & produk UMKM.",
    sample: "Aa Bb 123",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    category: "Elegan & Mewah",
    className: "font-playfair",
    description: "Serif klasik mewah. Cocok untuk workshop seni, fesyen, seminar VIP & kecantikan.",
    sample: "Aa Bb 123",
  },
  {
    id: "jetbrains",
    name: "JetBrains Mono",
    category: "Developer & Tech",
    className: "font-jetbrains",
    description: "Monospace tajam. Pilihan utama untuk hackathon, workshop coding & esport.",
    sample: "Aa Bb 123",
  },
];

export function getFontClassName(fontId?: string | null): string {
  switch (fontId) {
    case "jakarta":
      return "font-jakarta";
    case "poppins":
      return "font-poppins";
    case "playfair":
      return "font-playfair";
    case "jetbrains":
      return "font-jetbrains";
    case "inter":
    default:
      return "font-inter";
  }
}

