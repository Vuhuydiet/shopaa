import { BrowserRouter } from 'react-router-dom';
import AllRoute from './components/AllRoutes';
import './App.css';
import GlobalProvider from './context/GlobalProvider';
import { AutoLogout } from './components/auto-logout';

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <GlobalProvider>
          <AutoLogout />
          <AllRoute />
        </GlobalProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
