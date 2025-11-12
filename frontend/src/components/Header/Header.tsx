import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo_No_Text.svg';
import { LinkButton } from '../LinkButton';

export const Header = () => {
  //delay hvis vi skal ha animasjon på logo (venstre side)
  const ANIMATION_DELAY_MS = 200; // 0.5 sekunder delay

  return (
    <header className="sticky top-0 z-50 bg-white">
      <section className="flex flex-row items-center justify-between border-b-2 border-gray-500 px-8 py-4">
        <Link to="/">
          <img 
            src={Logo} 
            alt="Logo" 
            className="w-70 header-logo-animate" 
            style={{
              animationDelay: `${ANIMATION_DELAY_MS}ms`
            }}
          />
        </Link>
        <LinkButton link="#contact" color="green">
          Kontakt Oss
        </LinkButton>
      </section>
    </header>
  );
};
