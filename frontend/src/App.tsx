import AllRoute from './components/AllRoutes';
import './App.css';
import { AutoLogout } from './utils/auto-logout';

function App() {
  AutoLogout();

  return <AllRoute />;
}

export default App;
