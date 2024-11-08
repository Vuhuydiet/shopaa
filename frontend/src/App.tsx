import { BrowserRouter } from 'react-router-dom';
import AllRoute from './components/AllRoutes';
import './App.css';
import HeaderComponent from './components/Header';

function App() {
  return (
    <>
      <BrowserRouter>
        <AllRoute />
        <HeaderComponent />
      </BrowserRouter>
    </>
  );
}

export default App;
