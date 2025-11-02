import { useEffect, type RefObject } from 'react';
import type { Site } from '../../types';
import { Link } from 'react-router-dom';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  site: Site[];
}

export const Dropdown = ({ isOpen, onClose, site }: MenuProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <nav>
      {site.map((site) => {
        return (
          <Link
            key={site.href}
            to={site.href}
            className=" fixed z-50 flex w-full cursor-pointer items-center justify-center gap-3 p-3 text-xl text-black md:hidden"
          >
            <section>{site.title}</section>
          </Link>
        );
      })}
    </nav>
  );
};
