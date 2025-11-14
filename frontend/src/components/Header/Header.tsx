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
          className="md:hidden flex items-center justify-center rounded-md border-2 border-gray-500 p-2"
          aria-label={isMenuOpen ? 'Lukk meny' : 'Åpne meny'}
          onClick={toggleMenu}
        >
          <span className="relative flex h-4 w-6 items-center justify-center">
            <span
              className={`absolute h-0.5 w-full bg-gray-900 transition-all duration-200 ease-out ${
                isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
              }`}
            />
            <span
              className={`absolute h-0.5 w-full bg-gray-900 transition-all duration-150 ease-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`absolute h-0.5 w-full bg-gray-900 transition-all duration-200 ease-out ${
                isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
              }`}
            />
          </span>
        </button>
      </section>
      {isMenuOpen && (
        <nav
          className="md:hidden absolute right-1 top-full mt-2 px-4 py-4 flex flex-col items-end gap-3 bg-transparent z-50"
          style={{ width: 'min(60vw, 220px)' }}
        >
          <div className="w-full">
            <LinkButton
              link="/"
              color="yellow"
              onClick={scrollToTop}
              className="w-full"
            >
              Hjem
            </LinkButton>
          </div>
          <div className="w-full">
            <LinkButton
              link="/faq"
              color="purple"
              onClick={closeMenu}
              className="w-full"
            >
              FAQ
            </LinkButton>
          </div>
          <div className="w-full">
            <LinkButton
              link="/#contact"
              color="green"
              onClick={closeMenu}
              className="w-full"
            >
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
