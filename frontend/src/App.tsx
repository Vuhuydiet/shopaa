import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LogIn } from './pages/login/login';
import { ResetPassword } from './pages/reset-password/reset-password';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
