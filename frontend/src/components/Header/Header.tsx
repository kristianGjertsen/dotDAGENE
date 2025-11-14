import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo_No_Text.svg';
import { LinkButton } from '../LinkButton';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-500 relative">
      <section className="flex flex-row items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" onClick={scrollToTop} className="shrink-0">
          <img src={Logo} alt="Logo" className="w-80 max-w-full" />
        </Link>
        <nav className="hidden items-center gap-2 sm:gap-2 md:flex">
          <LinkButton link="/" color="yellow">
            Hjem
          </LinkButton>
          <LinkButton link="/faq" color="purple">
            FAQ
          </LinkButton>
          <LinkButton link="/#contact" color="green">
            Kontakt Oss
          </LinkButton>
        </nav>
        <button
          className="md:hidden flex flex-col items-center justify-center gap-1.5 
             rounded-md border-2 border-gray-500 p-2"
          aria-label="Åpne meny"
          onClick={toggleMenu}
        >
          <span
            className={`h-0.5 w-5 bg-gray-900 transition-transform ${isMenuOpen ? 'translate-y-1.5 rotate-45' : ''
              }`}
          />
          <span
            className={`h-0.5 w-5 bg-gray-900 transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`}
          />
          <span
            className={`h-0.5 w-5 bg-gray-900 transition-transform ${isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
              }`}
          />
        </button>
      </section>
      {isMenuOpen && (
        <nav
          className="md:hidden absolute right-2 top-full mt-2 px-6 py-4 flex flex-col items-end gap-3 bg-transparent z-50"
          style={{ width: 'min(60vw, 200px)' }}
        >
          <div className="w-full text-right">
            <LinkButton link="/" color="yellow" onClick={scrollToTop}>
              Hjem
            </LinkButton>
          </div>
          <div className="w-full text-right">
            <LinkButton link="/faq" color="purple" onClick={closeMenu}>
              FAQ
            </LinkButton>
          </div>
          <div className="w-full text-right">
            <LinkButton link="/#contact" color="green" onClick={closeMenu}>
              Kontakt Oss
            </LinkButton>
          </div>
        </nav>
      )}
      {isMenuOpen && (
        <button
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          aria-label="Lukk meny"
          onClick={closeMenu}
        />
      )}
    </header>
  );
};
