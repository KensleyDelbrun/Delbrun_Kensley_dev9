import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const TEXT_SIZE_KEY = '@settings_text_size';
const DARK_MODE_KEY = '@settings_dark_mode';
const DARK_MODE_AUTO_KEY = '@settings_dark_mode_auto';

type ColorScheme = 'light' | 'dark';

type AppearanceContextType = {
  textSize: number;
  setTextSize: (size: number) => void;
  isDarkMode: boolean; // The effective, final dark mode state
  manualDarkMode: boolean; // The user's manual preference
  colorScheme: ColorScheme;
  autoDarkMode: boolean;
  setAutoDarkMode: (auto: boolean) => Promise<void>;
  setManualDarkMode: (dark: boolean) => Promise<void>;
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    borderLight: string;
    primary: string;
    error: string;
    success: string;
    warning: string;
  };
};

const AppearanceContext = createContext<AppearanceContextType | undefined>(undefined);

const lightColors = {
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  primary: '#3B82F6',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
};

const darkColors = {
  background: '#111827',
  surface: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  borderLight: '#4B5563',
  primary: '#3B82F6',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
};

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [textSize, setTextSizeState] = useState(1.0);
  const [manualDarkModeState, setManualDarkModeState] = useState(false);
  const [autoDarkMode, setAutoDarkModeState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine the effective dark mode
  const effectiveDarkMode = autoDarkMode ? systemColorScheme === 'dark' : manualDarkModeState;
  const colorScheme: ColorScheme = effectiveDarkMode ? 'dark' : 'light';
  const colors = effectiveDarkMode ? darkColors : lightColors;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [storedSize, storedDarkMode, storedAutoDarkMode] = await Promise.all([
          AsyncStorage.getItem(TEXT_SIZE_KEY),
          AsyncStorage.getItem(DARK_MODE_KEY),
          AsyncStorage.getItem(DARK_MODE_AUTO_KEY),
        ]);
        
        if (storedSize !== null) {
          setTextSizeState(parseFloat(storedSize));
        }
        if (storedDarkMode !== null) {
          setManualDarkModeState(storedDarkMode === 'true');
        }
        if (storedAutoDarkMode !== null) {
          setAutoDarkModeState(storedAutoDarkMode === 'true');
        }
      } catch (error) {
        console.error('Failed to load appearance settings from storage', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSettings();
  }, []);

  const setTextSize = async (size: number) => {
    try {
      await AsyncStorage.setItem(TEXT_SIZE_KEY, JSON.stringify(size));
      setTextSizeState(size);
    } catch (error) {
      console.error('Failed to save text size to storage', error);
    }
  };

  const setAutoDarkMode = async (auto: boolean) => {
    try {
      await AsyncStorage.setItem(DARK_MODE_AUTO_KEY, String(auto));
      setAutoDarkModeState(auto);
    } catch (error) {
      console.error('Failed to save auto dark mode setting', error);
    }
  };

  const setManualDarkMode = async (dark: boolean) => {
    try {
      await AsyncStorage.setItem(DARK_MODE_KEY, String(dark));
      setManualDarkModeState(dark);
    } catch (error) {
      console.error('Failed to save dark mode setting', error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <AppearanceContext.Provider value={{ 
      textSize, 
      setTextSize,
      isDarkMode: effectiveDarkMode,
      manualDarkMode: manualDarkModeState,
      colorScheme,
      autoDarkMode,
      setAutoDarkMode,
      setManualDarkMode,
      colors,
    }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error('useAppearance must be used within an AppearanceProvider');
  }
  return context;
}
