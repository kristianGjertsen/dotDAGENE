import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo_No_Text.svg';
import { LinkButton } from '../LinkButton';

export const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <section className="flex flex-row items-center justify-between border-b-2 border-gray-500 px-8 py-4">
        <Link to="/" onClick={scrollToTop}>
          <img src={Logo} alt="Logo" className="w-80" />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-2">
          <LinkButton link="/" color='yellow'>
            Hjem
          </LinkButton>
          <LinkButton link="/faq" color='purple'>
            FAQ
          </LinkButton>
          <LinkButton link="/#contact" color="green">
            Kontakt Oss
          </LinkButton>
        </nav>
      </section>
    </header>
  );
};
