import { Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <nav>
      <Link to="/">Home Page</Link> | <Link to="/login">Login</Link>
    </nav>
  );
}

export default App;
