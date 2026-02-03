export type StandId =
  | "stand-1"
  | "stand-2"
  | "stand-3"
  | "stand-4"
  | "stand-5"
  | "stand-6"
  | "stand-7"
  | "stand-8"
  | "stand-9"
  | "stand-10"
  | "stand-11"

export type StandData = {
  label: string;
  company: string;
  logo?: string;
  logoScale?: number;
};

export const standMap: Record<StandId, StandData> = {
  "stand-1": { label: "1", company: "Maritime Optima", logo: "maritimeOptima.png", logoScale: 1 },
  "stand-2": { label: "2", company: "Bekk", logo: "Bekk.png", logoScale: 1.4 },
  "stand-3": { label: "3", company: "Skatteetaten", logo: "Skatteetaten.svg", logoScale: 1 },
  "stand-4": { label: "4", company: "Kommer Snart" },
  "stand-5": { label: "5", company: "Norsk Regnesentral", logo: "NorskRegnesentral.svg", logoScale: 1.9 },
  "stand-6": { label: "6", company: "Tripletex", logo: "tripletex.svg", logoScale: 1 },
  "stand-7": { label: "7", company: "Xledger", logo: "xledger.webp", logoScale: 1.6 },
  "stand-8": { label: "8", company: "Itera", logo: "Itera.png", logoScale: 1 },
  "stand-9": { label: "9", company: "DIPS", logo: "dips.png", logoScale: 1.3 },
  "stand-10": { label: "10", company: "Mastercard", logo: "Mastercard.svg", logoScale: 1.2 },
  "stand-11": { label: "11", company: "dotDAGENE", logo: "dotDAGENEhovedlogo.svg", logoScale: 1.2 },
};
