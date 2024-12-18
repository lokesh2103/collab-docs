import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeContextProvider } from './ThemeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <ThemeContextProvider>
    <App />
  </ThemeContextProvider>
);
