import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import GlobalProvider from './context/GlobalProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/">
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </BrowserRouter>,
);
