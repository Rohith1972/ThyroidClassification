import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
    const { theme, toggleTheme, isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const themes = [
        { value: 'light', label: 'Light', icon: Sun, description: 'Light mode' },
        { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark mode' },
        { value: 'system', label: 'System', icon: Monitor, description: 'Use system preference' }
    ];

    const currentTheme = themes.find(t => t.value === theme);

    const handleThemeSelect = (themeValue) => {
        toggleTheme(themeValue);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative z-[60]" ref={dropdownRef}>
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-3 rounded-xl border transition-all duration-300 ${
                    isDark 
                        ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                } shadow-sm`}
                title="Change theme"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={theme}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentTheme && <currentTheme.icon size={20} />}
                    </motion.div>
                </AnimatePresence>
            </motion.button>

            {/* Theme Options Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border shadow-xl z-50 overflow-hidden ${
                            isDark
                                ? 'bg-slate-800 border-slate-700'
                                : 'bg-white border-slate-200'
                        }`}
                    >
                        <div className="p-2">
                            {themes.map((themeOption) => {
                                const Icon = themeOption.icon;
                                const isActive = theme === themeOption.value;

                                return (
                                    <motion.button
                                        key={themeOption.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleThemeSelect(themeOption.value)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                            isActive
                                                ? isDark
                                                    ? 'bg-brand-600 text-white shadow-lg'
                                                    : 'bg-brand-500 text-white shadow-lg'
                                                : isDark
                                                    ? 'hover:bg-slate-700 text-slate-300'
                                                    : 'hover:bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        <div className={`p-2 rounded-lg ${
                                            isActive
                                                ? 'bg-white/20'
                                                : isDark
                                                    ? 'bg-slate-700'
                                                    : 'bg-slate-100'
                                        }`}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-semibold text-sm ${
                                                isActive
                                                    ? 'text-white'
                                                    : isDark
                                                        ? 'text-slate-200'
                                                        : 'text-slate-800'
                                            }`}>
                                                {themeOption.label}
                                            </div>
                                            <div className={`text-xs ${
                                                isActive
                                                    ? 'text-white/80'
                                                    : isDark
                                                        ? 'text-slate-400'
                                                        : 'text-slate-500'
                                            }`}>
                                                {themeOption.description}
                                            </div>
                                        </div>
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-indicator"
                                                className={`w-2 h-2 rounded-full ${
                                                    isDark ? 'bg-white' : 'bg-brand-500'
                                                }`}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThemeToggle;
