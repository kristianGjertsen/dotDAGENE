import companiesData from "../ParticipatingCompanies/Companies.json";

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

const companies = Array.isArray(companiesData.companies)
  ? companiesData.companies
  : [];

const getCompanyData = (name: string) => companies.find((company) => company.name === name);

//Mapper stand id til stand info
const standCompanies: Record<StandId, { label: string; company: string }> = {
  "stand-1": { label: "1", company: "Maritime Optima" },
  "stand-2": { label: "2", company: "Bekk" },
  "stand-3": { label: "3", company: "Skatteetaten" },
  "stand-4": { label: "4", company: "Kommer Snart" },
  "stand-5": { label: "5", company: "Norsk Regnesentral" },
  "stand-6": { label: "6", company: "Tripletex" },
  "stand-7": { label: "7", company: "Xledger" },
  "stand-8": { label: "8", company: "Itera" },
  "stand-9": { label: "9", company: "DIPS" },
  "stand-10": { label: "10", company: "Mastercard" },
  "stand-11": { label: "11", company: "dotDAGENE" },
};

//Exporterer json data med logo info og logo skala
export const standMap: Record<StandId, StandData> = Object.fromEntries(
  (Object.entries(standCompanies) as Array<[StandId, { label: string; company: string }]>).map(
    ([id, stand]) => {
      const companyData = getCompanyData(stand.company);
      return [
        id,
        {
          label: stand.label,
          company: stand.company,
          logo: companyData?.logo,
          logoScale: companyData?.logoScale,
        },
      ];
    },
  ),
) as Record<StandId, StandData>;
