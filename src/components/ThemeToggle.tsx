import { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon, Desktop, CaretDown } from '@phosphor-icons/react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
    const [theme, setThemeState] = useState<Theme>('system');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setThemeState(savedTheme);
        }
    }, []);

    const applyTheme = useCallback((newTheme: Theme) => {
        const root = document.documentElement;
        let isDark = false;

        if (newTheme === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            isDark = newTheme === 'dark';
        }

        root.classList.toggle('dark', isDark);
        root.style.colorScheme = isDark ? 'dark' : 'light';
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [theme, applyTheme]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemChange = () => {
            if (theme === 'system') {
                applyTheme('system');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        mediaQuery.addEventListener('change', handleSystemChange);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            mediaQuery.removeEventListener('change', handleSystemChange);
        };
    }, [theme, applyTheme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        if (newTheme === 'system') {
            localStorage.removeItem('theme');
        } else {
            localStorage.setItem('theme', newTheme);
        }
        setIsOpen(false);
    };

    const labels: Record<Theme, string> = {
        light: 'Claro',
        dark: 'Oscuro',
        system: 'Sistema'
    };

    const icons: Record<Theme, React.ReactNode> = {
        light: <Sun weight="bold" className="h-4 w-4" />,
        dark: <Moon weight="bold" className="h-4 w-4" />,
        system: <Desktop weight="bold" className="h-4 w-4" />
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    className="group inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:outline-none ring-1 ring-transparent focus:ring-blue-500"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <span className="flex items-center justify-center h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 transition-colors">
                        {icons[theme]}
                    </span>
                    <CaretDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {isOpen && (
                <div
                    className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200"
                    role="menu"
                    aria-orientation="vertical"
                >
                    <div className="py-1 px-1" role="none">
                        {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={`flex w-full items-center gap-3 px-3 py-2 text-sm rounded-md transition-all ${theme === t
                                    ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                                    }`}
                                role="menuitem"
                            >
                                <span className={theme === t ? 'text-blue-500' : 'text-slate-400'}>
                                    {icons[t]}
                                </span>
                                {labels[t]}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
