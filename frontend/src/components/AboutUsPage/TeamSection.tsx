const teamRoles = [
    {
        title: 'Leder',
        name: 'Person Personsen',
        initial: 'L',
        avatarBg: 'bg-dotpurple',
    },
    {
        title: 'Nestleder',
        name: 'Person Personsen',
        initial: 'N',
        avatarBg: 'bg-dotgreen',
    },
    {
        title: 'Økonomiansvarlig',
        name: 'Person Personsen',
        initial: 'Ø',
        avatarBg: 'bg-dotyellow text-black',
    },
    {
        title: 'Bedriftsansvarlig',
        name: 'Person Personsen',
        initial: 'B',
        avatarBg: 'bg-dotpurple',
    },
    {
        title: 'Nettside og grafisk ansvarlig',
        name: 'Person Personsen',
        initial: 'NG',
        avatarBg: 'bg-dotgreen',
    },
    {
        title: 'Arrangementsansvarlig',
        name: 'Person Personsen',
        initial: 'A',
        avatarBg: 'bg-dotpurple',
    },
    {
        title: 'Markedsføringsansvarlig',
        name: 'Person Personsen',
        initial: 'M',
        avatarBg: 'bg-dotyellow text-black',
    },
];
const TeamSection = () => {

    return (
        <section className="mx-auto mt-24 max-w-6xl px-6 sm:px-12">
            <div className="text-center">
                <h2 className="mt-3 text-4xl font-medium">Ledelsen</h2>
            </div>

            <div
                className="mt-25 mx-auto grid max-w-4xl place-items-center
               gap-x-6 gap-y-28 grid-cols-1 md:grid-cols-2 lg:hidden"
            >
                {teamRoles.map((role, index) => {
                    const isLastOdd =
                        teamRoles.length % 2 === 1 && index === teamRoles.length - 1;

                    return (
                        <div
                            key={role.title}
                            className={isLastOdd ? 'md:col-span-2 flex justify-center' : ''}
                        >
                            <article
                                className="relative flex w-full max-w-xs flex-col items-center justify-end gap-2
                       border-3 border-black bg-white px-6 pb-6 pt-20 text-center
                       shadow-[8px_8px_0_0_rgba(0,0,0,0.08)]"
                            >
                                <div
                                    aria-hidden="true"
                                    className={`absolute -top-20 left-1/2 flex h-32 w-32 -translate-x-1/2 transform
                          items-center justify-center rounded-full border-3 border-black ${role.avatarBg}`}
                                >
                                    <span className="text-3xl font-semibold">{role.initial}</span>
                                </div>
                                <h3 className="text-2xl font-semibold">{role.name}</h3>
                                <p className="text-sm font-semibold text-gray-500">
                                    {role.title}
                                </p>
                            </article>
                        </div>
                    );
                })}
            </div>

            <div
                className="mt-40 mx-auto hidden max-w-5xl flex-col items-center
               gap-y-28 lg:flex">
                <div
                    className="grid mx-auto max-w-3xl place-items-center
                 gap-x-6 gap-y-28 grid-cols-1 sm:grid-cols-2">
                    {teamRoles.slice(0, 2).map((role) => (
                        <article
                            key={role.title}
                            className="relative flex w-full max-w-xs flex-col items-center justify-end gap-2
                     border-3 border-black bg-white px-6 pb-6 pt-20 text-center
                     shadow-[8px_8px_0_0_rgba(0,0,0,0.08)]">
                            <div
                                aria-hidden="true"
                                className={`absolute -top-20 left-1/2 flex h-32 w-32 -translate-x-1/2 transform
                        items-center justify-center rounded-full border-3 border-black ${role.avatarBg}`}
                            >
                                <span className="text-3xl font-semibold">{role.initial}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{role.name}</h3>
                            <p className="text-sm font-semibold text-gray-500">
                                {role.title}
                            </p>
                        </article>
                    ))}
                </div>

                <div
                    className="grid mx-auto max-w-4xl place-items-center
                 gap-x-6 gap-y-28 grid-cols-1 sm:grid-cols-3">
                    {teamRoles.slice(2, 5).map((role) => (
                        <article
                            key={role.title}
                            className="relative flex w-full max-w-xs flex-col items-center justify-end gap-2
                     border-3 border-black bg-white px-6 pb-6 pt-20 text-center
                     shadow-[8px_8px_0_0_rgba(0,0,0,0.08)]"
                        >
                            <div
                                aria-hidden="true"
                                className={`absolute -top-20 left-1/2 flex h-32 w-32 -translate-x-1/2 transform
                        items-center justify-center rounded-full border-3 border-black ${role.avatarBg}`}
                            >
                                <span className="text-3xl font-semibold">{role.initial}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{role.name}</h3>
                            <p className="text-sm font-semibold text-gray-500">
                                {role.title}
                            </p>
                        </article>
                    ))}
                </div>

                <div
                    className="grid mx-auto max-w-3xl place-items-center
                 gap-x-6 gap-y-28 grid-cols-1 sm:grid-cols-2">
                    {teamRoles.slice(5).map((role) => (
                        <article
                            key={role.title}
                            className="relative flex w-full max-w-xs flex-col items-center justify-end gap-2
                     border-3 border-black bg-white px-6 pb-6 pt-20 text-center
                     shadow-[8px_8px_0_0_rgba(0,0,0,0.08)]">
                            <div
                                aria-hidden="true"
                                className={`absolute -top-20 left-1/2 flex h-32 w-32 -translate-x-1/2 transform
                        items-center justify-center rounded-full border-3 border-black ${role.avatarBg}`}>
                                <span className="text-3xl font-semibold">{role.initial}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{role.name}</h3>
                            <p className="text-sm font-semibold text-gray-500">
                                {role.title}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
