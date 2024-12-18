// ThemeContext.tsx
import { createContext, useState, useMemo, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from './theme';

export const ThemeContext = createContext({
  toggleTheme: () => {},
});

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
