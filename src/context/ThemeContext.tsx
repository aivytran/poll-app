'use client';
import { createContext, ReactNode, useContext, useState } from 'react';

// Define the available themes
export type BackgroundTheme = 'bubbles' | 'particles' | 'gradient' | 'waves' | 'confetti';

// Theme context interface
interface ThemeContextType {
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  backgroundTheme: 'bubbles',
  setBackgroundTheme: () => {},
});

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('bubbles');

  return (
    <ThemeContext.Provider value={{ backgroundTheme, setBackgroundTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
