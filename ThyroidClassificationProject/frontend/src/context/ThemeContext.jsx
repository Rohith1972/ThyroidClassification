import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const VALID_THEMES = ['light', 'dark', 'system'];

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const getSystemTheme = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved && VALID_THEMES.includes(saved)) return saved;
        return 'system';
    });
    const [systemTheme, setSystemTheme] = useState(getSystemTheme);
    const resolvedTheme = theme === 'system' ? systemTheme : theme;

    useEffect(() => {
        const root = document.documentElement;

        // Tailwind class strategy relies only on the `dark` class.
        root.classList.toggle('dark', resolvedTheme === 'dark');
        root.style.colorScheme = resolvedTheme;
        localStorage.setItem('theme', theme);
    }, [theme, resolvedTheme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => setSystemTheme(e.matches ? 'dark' : 'light');

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = (newTheme) => {
        if (!VALID_THEMES.includes(newTheme)) return;
        setTheme(newTheme);
    };

    const value = {
        theme,
        toggleTheme,
        resolvedTheme,
        isDark: resolvedTheme === 'dark',
        isLight: resolvedTheme === 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
