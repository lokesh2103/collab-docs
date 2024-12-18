import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor/:id" element={<EditorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
