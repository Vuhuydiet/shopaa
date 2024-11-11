import { BrowserRouter } from 'react-router-dom';
import AllRoute from './components/AllRoutes';
import './App.css';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <AllRoute />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
