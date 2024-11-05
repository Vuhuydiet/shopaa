import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AllRoute from './components/AllRoutes';
import './App.css';
import { LogIn } from './pages/login/login';
import { ResetPassword } from './pages/reset-password/reset-password';

function App() {
  return (<>
    <BrowserRouter>
      <AllRoute />
    </BrowserRouter>
      </>
  );
}

export default App;
