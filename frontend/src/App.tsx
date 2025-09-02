import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './App.css'; // Залишаємо CSS файл

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Домашня</Link> | <Link to="/login">Вхід</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
