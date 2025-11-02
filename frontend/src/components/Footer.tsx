import Logo from '../assets/litenDfarget.svg';
import Instagram from '../assets/instagram.svg';
import Linkedin from '../assets/linkedin.svg';
import Facebook from '../assets/facebook.svg';

const a_className = 'text-gray-100 hover:text-dotyellow';

export const Footer = () => {
  return (
    <footer className="mt-20 flex justify-center border-t-3 bg-black">
      <section className="m-8 mt-12 flex w-full flex-col justify-around gap-2 md:flex-row md:flex-wrap md:gap-8">
        <section>
          <img src={Logo} alt="Logo" className="w-16 md:mb-4" />
          <p className="mb-5 w-3/4 text-gray-100 md:w-4/5 md:text-xl">
            NTNUs nyeste karrieredag innen digitalisering og teknologi.
          </p>
        </section>
        <section className="flex flex-col md:text-xl">
          <h2 className="text-lg text-gray-100 md:text-2xl">Hurtiglenker</h2>
          <a className={a_className} href="">
            Hjem
          </a>
          <a className={a_className} href="">
            Om oss
          </a>
          <a className={a_className} href="">
            Kontakt oss
          </a>
        </section>
        <section className="flex flex-col gap-3 text-gray-100">
          <h2 className="text-lg md:text-2xl">Følg oss</h2>
          <section className="flex gap-3">
            <a href="https://www.instagram.com/dotdagene/">
              <img src={Instagram} />
            </a>
            <a href="">
              <img src={Linkedin} />
            </a>
            <a href="">
              <img src={Facebook} />
            </a>
          </section>
        </section>
        <p className="mt-6 w-full border-t-1 border-gray-100 pt-6 text-center text-gray-100">
          © 2025 dotDAGENE
        </p>
      </section>
    </footer>
  );
};
