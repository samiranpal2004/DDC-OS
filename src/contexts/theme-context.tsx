import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';
export type VisualStyle = 'glass' | 'solid';

interface ThemeSettings {
  mode: ThemeMode;
  style: VisualStyle;
  blurStrength: number;
  borderRadius: number;
  textSize: number;
  transparency: number;
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeSettings = {
  mode: 'dark',
  style: 'glass',
  blurStrength: 12,
  borderRadius: 12,
  textSize: 1,
  transparency: 0.05,
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: () => {},
  resetTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('dashy-theme');
    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme));
      } catch (error) {
        console.error('Failed to parse saved theme', error);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme.mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      
      // Dark mode CSS variables
      root.style.setProperty('--dock-bg', 'rgba(15, 15, 30, 0.8)');
      root.style.setProperty('--dock-border', 'rgba(255, 255, 255, 0.15)');
      root.style.setProperty('--dock-item-bg', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--dock-item-hover', 'rgba(255, 255, 255, 0.15)');
      
      root.style.setProperty('--widget-text', '255, 255, 255');
      root.style.setProperty('--widget-text-muted', '180, 180, 190');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      
      // Light mode CSS variables
      root.style.setProperty('--dock-bg', 'rgba(240, 240, 245, 0.8)');
      root.style.setProperty('--dock-border', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--dock-item-bg', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--dock-item-hover', 'rgba(0, 0, 0, 0.15)');
      
      root.style.setProperty('--widget-text', '20, 20, 30');
      root.style.setProperty('--widget-text-muted', '80, 80, 100');
    }
    
    // Glass effect properties remain constant regardless of theme mode
    root.style.setProperty('--blur-strength', `${theme.blurStrength}px`);
    root.style.setProperty('--border-radius', `${theme.borderRadius}px`);
    root.style.setProperty('--text-size', theme.textSize.toString());
    root.style.setProperty('--glass-transparency', theme.transparency.toString());
    
    // Only update solid background properties when in solid mode
    if (theme.style === 'solid') {
      if (theme.mode === 'dark') {
        root.style.setProperty('--solid-bg-color', '15, 15, 30');
        root.style.setProperty('--solid-bg-opacity', '0.95');
      } else {
        root.style.setProperty('--solid-bg-color', '255, 255, 255');
        root.style.setProperty('--solid-bg-opacity', '1');
      }
    }
    
    localStorage.setItem('dashy-theme', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (settings: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...settings }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
