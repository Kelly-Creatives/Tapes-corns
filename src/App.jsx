import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import TrendingPage from './pages/TrendingPage';
import ActionPage from './pages/ActionPage';
import DramaPage from './pages/DramaPage';
import ComedyPage from './pages/ComedyPage';
import SciFiPage from './pages/SciFiPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/action" element={<ActionPage />} />
        <Route path="/drama" element={<DramaPage />} />
        <Route path="/comedy" element={<ComedyPage />} />
        <Route path="/sci-fi" element={<SciFiPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
