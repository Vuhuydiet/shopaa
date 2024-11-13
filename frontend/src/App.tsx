import { BrowserRouter } from 'react-router-dom';
import AllRoute from './components/AllRoutes';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './service/state/store';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AllRoute />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App;
