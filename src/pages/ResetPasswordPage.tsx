import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ParticleBackground } from '../components/ParticleBackground';
import { supabase } from '../lib/supabase';

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSuccess(false);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/sign-in');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4cd137] to-[#44bd32] dark:from-[#273c75] dark:to-[#192a56] flex items-center justify-center relative overflow-hidden transition-colors duration-300">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#4cd137] to-[#44bd32] rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            {t('auth.resetPassword')}
          </h2>

          {!success ? (
            <>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                {t('auth.enterNewPassword')}
              </p>

              {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg animate-shake">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.newPassword')}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4cd137] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4cd137] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#4cd137] to-[#44bd32] text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '...' : t('auth.updatePassword')}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {t('auth.passwordUpdated')}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Redirecting to sign in...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
