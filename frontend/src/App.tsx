import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/contact" element={<ContactFormPage />} /> */}
      </Routes>
    </Router>
  );
}
