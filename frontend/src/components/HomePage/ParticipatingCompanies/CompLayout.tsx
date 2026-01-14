import { useEffect, useState } from 'react';
import companiesData from './Companies.json';
import { CompBox, type Company } from './CompBox';

export const CompLayout = () => {
    const [activeCompany, setActiveCompany] = useState<Company | null>(null);
    const companies: Company[] = Array.isArray(companiesData.companies)
        ? companiesData.companies
        : [];

    useEffect(() => {
        if (activeCompany) {
            const previous = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = previous;
            };
        }

        return undefined;
    }, [activeCompany]);

    useEffect(() => {
        if (!activeCompany) {
            return undefined;
        }

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActiveCompany(null);
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [activeCompany]);

    return (
        <section className="px-6 py-20 sm:px-12 lg:px-20">
            <h2 className="text-center text-4xl font-semibold text-gray-900">
                Deltagene bedrifter i 2026
            </h2>
            <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] justify-center gap-6">
                {companies.map((company) => {
                    return (
                        <button
                            key={company.name}
                            type="button"
                            className="block h-full text-left"
                            onClick={() => setActiveCompany(company)}
                        >
                            <div className="relative flex h-full min-h-[220px] flex-col items-center justify-between gap-6 overflow-hidden border-3 border-black bg-white px-6 py-10 text-center shadow-[6px_6px_0px_#000] transition-transform duration-150 hover:-translate-y-1">
                                {company.logo && (
                                    <div className="relative z-0 flex w-full items-center justify-center">
                                        <img
                                            src={new URL(`./Logos/${company.logo}`, import.meta.url).href}
                                            alt={company.name}
                                            className="h-20 w-auto object-contain"
                                            style={{ transform: `scale(${company.logoScale ?? 1})` }}
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                <p className="relative z-10 bg-white/80 px-2 text-lg font-semibold">
                                    {company.name}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {activeCompany && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setActiveCompany(null)}
                >
                    <div
                        className="relative w-full max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveCompany(null)}
                            className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xl font-bold leading-none shadow-[3px_3px_0px_#000]"
                            aria-label="Lukk"
                        >
                            ×
                        </button>

                        <CompBox company={activeCompany} />
                    </div>
                </div>
            )}
        </section>
    );
};
