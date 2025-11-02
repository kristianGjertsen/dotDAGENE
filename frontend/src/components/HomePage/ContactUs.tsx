import {
  CalendarIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';

export const ContactUs = () => {
  return (
    <section
      className="bg-dotgreen flex w-full flex-col gap-4 border-3 border-black p-6 text-white"
      id="contact"
    >
      <h3 className="text-3xl">KONTAKT DOTDAGENE</h3>
      <p>
        Vi arrangerer NTNUs nyeste karrieredag innen digitalisering og
        teknologi. Kontakt oss for å sikre din bedrift en plass på
        arrangementet.
      </p>
      <section className="bg-dotpurple flex flex-row border-3 border-black p-6">
        <div className="w-16">
          <EnvelopeIcon className="h-8 w-8" />
        </div>
        <div className="flex flex-col">
          <p>E-POST</p>
          <p>kontakt@dotdagene.no</p>
        </div>
      </section>
      {/* <div className="bg-dotpurple flex flex-row border-3 border-black p-6">
        <div className="w-16">
          <PhoneIcon className="h-8 w-8" />
        </div>
        <div className="flex flex-col">
          <p>TELEFON</p>
          <p>+47 123 45 678</p>
        </div>
      </div> */}
      <div className="bg-dotpurple flex flex-row border-3 border-black p-6">
        <div className="w-16">
          <CalendarIcon className="h-8 w-8" />
        </div>
        <div className="flex flex-col">
          <p>DATO</p>
          <p>3. mars 2026</p>
        </div>
      </div>
      <div className="bg-dotpurple flex flex-row border-3 border-black p-6">
        <div className="w-16">
          <MapPinIcon className="h-8 w-8" />
        </div>
        <div className="flex flex-col">
          <p>LOKASJON</p>
          <p>Realfagsbygget U1 NTNU Gløshaugen, Trondheim</p>
        </div>
      </div>
      <div className="bg-dotpurple flex flex-row border-3 border-black p-6">
        <div className="w-16">
          <UserGroupIcon className="h-8 w-8" />
        </div>
        <div className="flex flex-col">
          <p>MÅLGRUPPE</p>
          <p>500+ studenter ved nformatikk på NTNU</p>
        </div>
      </div>
    </section>
  );
};
