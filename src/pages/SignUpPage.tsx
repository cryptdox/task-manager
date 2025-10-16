import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ParticleBackground } from '../components/ParticleBackground';

export function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response = await signUp(email, password);
      console.log('r: ', response?.user?.user_metadata?.email_verified, response)
      const email_verified = response?.user?.user_metadata?.email_verified ?? true
      email_verified ?
        navigate('/task-manager')
        :
        navigate('/task-manager?send_confirm_email=true');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9c88ff] to-[#8c7ae6] dark:from-[#273c75] dark:to-[#192a56] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#9c88ff] to-[#8c7ae6] rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            {t('auth.signUp')}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9c88ff] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9c88ff] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#9c88ff] to-[#8c7ae6] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : t('auth.signUpButton')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/sign-in" className="text-[#9c88ff] hover:text-[#8c7ae6] font-semibold">
                {t('auth.signInHere')}
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {/* {t('auth.alreadyHaveAccount')}{' '} */}
              <Link to="/" className="text-[#9c88ff] hover:text-[#8c7ae6] font-semibold">
                {t('nav.backHome')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
