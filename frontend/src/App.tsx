import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AllRoute from './components/AllRoutes';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AllRoute />
    </BrowserRouter>
  );
};

export default App;
