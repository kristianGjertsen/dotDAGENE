import { LinkButton } from "../../Elements/LinkButton";

export type Company = {
    name: string;
    logo?: string;
    website?: string;
    logoScale?: number;
    description?: string;
};

type CompBoxProps = {
    company: Company;
};

export const CompBox = ({ company }: CompBoxProps) => {
    const logoSrc = company.logo
        ? new URL(`./Logos/${company.logo}`, import.meta.url).href
        : undefined;
    const scale = company.logoScale ?? 1;

    return (
        <div className="relative flex w-full flex-col items-center gap-6 overflow-hidden border-3 border-black bg-white px-8 py-12 text-center shadow-[10px_10px_0px_#000]">
            {logoSrc && (
                <div className="relative z-0 flex w-full items-center justify-center">
                    <img
                        src={logoSrc}
                        alt={company.name}
                        className="h-24 w-auto object-contain"
                        style={{ transform: `scale(${scale})` }}
                        loading="lazy"
                    />
                </div>
            )}
            <p className="relative z-10 bg-white/80 px-2 text-2xl font-semibold">
                {company.name}
            </p>
            {company.description && (
                <p className="relative z-10 bg-white/80 px-2 text-base text-gray-700">
                    {company.description}
                </p>
            )}
            {company.website && (

                <LinkButton link={company.website ?? ''} color="green" size="sm">
                    Besøk nettside
                </LinkButton>

            )
            }
        </div >
    );
};
