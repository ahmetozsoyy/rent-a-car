import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
import { useSignalR } from './hooks/useSignalR';

function AppContent() {
  useSignalR();
  
  return (
    <>
      <Toaster position="top-right" containerStyle={{ top: 80, right: 20 }} />
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
        <Route path="/demo-admin" element={<AdminPanel isDemo={true} />} />
        <Route path="/moderator" element={<ModeratorPanel />} />
        <Route path="/demo-moderator" element={<ModeratorPanel isDemo={true} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
