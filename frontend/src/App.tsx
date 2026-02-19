import { useEffect, type JSX } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import { FaqPage } from './pages/FaqPage';
import { HomePage } from './pages/HomePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { TestPage } from './pages/TestPage';
import routeManifest from './routes.json';

type RouteDefinition = {
  path: string;
};

const routes: RouteDefinition[] = routeManifest;

const routeComponents: Record<string, JSX.Element> = {
  '/': <HomePage />,
  '/faq': <FaqPage />,
  '/om': <AboutUsPage />,
  '/test': <TestPage />,
};

const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.search]);

  return null;
};

export function App() {
  return (
    <Router>
      <ScrollManager />
      <Routes>
        {routes.map(({ path }) => {
          const element = routeComponents[path];

          if (!element) {
            console.warn(`Missing component mapping for route "${path}"`);
            return null;
          }

          return <Route key={path} path={path} element={element} />;
        })}
      </Routes>
    </Router>
  );
}
