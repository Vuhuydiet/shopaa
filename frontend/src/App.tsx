import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { LogIn } from './pages/login/login';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
