import { Link } from 'react-router-dom';
import { CheckCircle2, Tag, Filter, Palette } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ParticleBackground } from '../components/ParticleBackground';

export function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: CheckCircle2,
      title: t('landing.features.periods.title'),
      description: t('landing.features.periods.description'),
      color: '#00a8ff'
    },
    {
      icon: Tag,
      title: t('landing.features.tags.title'),
      description: t('landing.features.tags.description'),
      color: '#9c88ff'
    },
    {
      icon: Filter,
      title: t('landing.features.filtering.title'),
      description: t('landing.features.filtering.description'),
      color: '#fbc531'
    },
    {
      icon: Palette,
      title: t('landing.features.themes.title'),
      description: t('landing.features.themes.description'),
      color: '#4cd137'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6fa] to-[#dcdde1] dark:from-[#2f3640] dark:to-[#353b48] relative overflow-hidden transition-colors duration-300">
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#00a8ff] via-[#9c88ff] to-[#4cd137] bg-clip-text text-transparent animate-gradient">
            {t('landing.hero.title')}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('landing.hero.subtitle')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/sign-up"
              className="px-8 py-4 bg-gradient-to-r from-[#00a8ff] to-[#0097e6] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              {t('nav.signUp')}
            </Link>
            <Link
              to="/sign-in"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-[#00a8ff] rounded-lg font-semibold border-2 border-[#00a8ff] hover:shadow-lg hover:scale-105 transform transition-all duration-300"
            >
              {t('nav.signIn')}
            </Link>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            {t('landing.hero.features')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/sign-up"
            className="inline-block px-12 py-5 bg-gradient-to-r from-[#4cd137] to-[#44bd32] text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-110 transform transition-all duration-300 animate-pulse-slow"
          >
            {t('landing.cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}
