import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Fleet from './pages/Fleet';
import SearchResults from './pages/SearchResults';
import Navbar from './components/Navbar';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ModeratorPanel from './pages/ModeratorPanel';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/moderator" element={<ModeratorPanel />} />
      </Routes>
      <footer style={{ padding: '3rem 2rem', textAlign: 'center', background: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="/images/vehicles/imza.png" alt="İmza" style={{ maxHeight: '60px', opacity: 0.9 }} />
      </footer>
    </Router>
  );
}

export default App;
