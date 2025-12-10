import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Globe, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#2f3640] shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-[#00a8ff] via-[#9c88ff] to-[#4cd137] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          {t('app.title')}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user && (
            <>
              <Link
                to="/"
                className={`font-medium transition-colors hover:text-[#00a8ff] ${
                  isActive('/') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/task-manager"
                className={`font-medium transition-colors hover:text-[#00a8ff] ${
                  isActive('/task-manager') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.taskManager')}
              </Link>
              <Link
                to="/task-store"
                className={`font-medium transition-colors hover:text-[#00a8ff] ${
                  isActive('/task-store') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.taskStore')}
              </Link>
              {/* <Link
                to="/vocabulary"
                className={`font-medium transition-colors hover:text-[#00a8ff] ${
                  isActive('/vocabulary') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.vocabulary')}
              </Link> */}
              <Link
                to="/administration"
                className={`font-medium transition-colors hover:text-[#00a8ff] ${
                  isActive('/administration') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('nav.administration')}
              </Link>
              <button
                onClick={handleSignOut}
                className="font-medium text-gray-700 dark:text-gray-300 hover:text-[#e84118] transition-colors"
              >
                {t('nav.signOut')}
              </button>
            </>
          )}

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
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden absolute left-0 right-0 bg-white dark:bg-[#2f3640] shadow-inner transition-colors duration-300">
          <div className="flex flex-col gap-4 px-4 py-4">
            {user && (
              <>
                <Link
                  to="/"
                  className={`font-medium transition-colors hover:text-[#00a8ff] ${
                    isActive('/') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>
                <Link
                  to="/task-manager"
                  className={`font-medium transition-colors hover:text-[#00a8ff] ${
                    isActive('/task-manager') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.taskManager')}
                </Link>
                <Link
                  to="/task-store"
                  className={`font-medium transition-colors hover:text-[#00a8ff] ${
                    isActive('/task-store') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.taskStore')}
                </Link>
                {/* <Link
                  to="/vocabulary"
                  className={`font-medium transition-colors hover:text-[#00a8ff] ${
                    isActive('/vocabulary') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.vocabulary')}
                </Link> */}
                <Link
                  to="/administration"
                  className={`font-medium transition-colors hover:text-[#00a8ff] ${
                    isActive('/administration') ? 'text-[#00a8ff]' : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.administration')}
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="font-medium text-gray-700 dark:text-gray-300 hover:text-[#e84118] transition-colors text-left"
                >
                  {t('nav.signOut')}
                </button>
              </>
            )}

            <div className="flex items-center gap-4 mt-2">
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
          </div>
        </nav>
      )}
    </header>
  );
}
