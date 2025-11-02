import { Link } from 'react-router-dom';
import Logo from '../../assets/dotDAGENEhovedlogo.svg';
import { LinkButton } from '../LinkButton';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <section className="flex flex-row items-center justify-between border-b-2 border-gray-500 px-8 py-4">
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-1/2" />
        </Link>
        <LinkButton link="#contact" color="green">
          Kontakt Oss
        </LinkButton>
      </section>
    </header>
  );
};
