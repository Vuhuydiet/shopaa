import { BrowserRouter } from 'react-router-dom';
import AllRoute from './components/AllRoutes';
import './App.css';
import GlobalProvider from './context/GlobalProvider';

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <GlobalProvider>
          <AllRoute />
        </GlobalProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
