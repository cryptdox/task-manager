import { Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="sticky bottom-0 z-50 bg-white dark:bg-[#2f3640] shadow-inner transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-end items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all transform hover:scale-110"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-[#192a56]" />
          ) : (
            <Sun className="w-5 h-5 text-[#fbc531]" />
          )}
        </button>

        <button
          onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all transform hover:scale-110 flex items-center gap-2"
          aria-label="Toggle language"
        >
          <Globe className="w-5 h-5 text-[#00a8ff]" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {language.toUpperCase()}
          </span>
        </button>
      </div>
    </footer>
  );
}
