
import { BrowserRouter } from 'react-router-dom';
import AllRoute from './components/AllRoutes';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <AllRoute />
      </BrowserRouter>
    </>

  );
}

export default App;
