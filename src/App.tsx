import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { TaskManagerPage } from './pages/TaskManagerPage';
import { AdministrationPage } from './pages/AdministrationPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

function AppRoutes() {
  const { user } = useAuth();
  const location = useLocation();

  const showHeader = location.pathname !== '/sign-in' && location.pathname !== '/sign-up' && location.pathname !== '/forgot-password';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in" element={user ? <Navigate to="/task-manager" replace /> : <SignInPage />} />
        <Route path="/sign-up" element={user ? <Navigate to="/task-manager" replace /> : <SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/task-manager"
          element={
            <ProtectedRoute>
              <TaskManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/administration"
          element={
            <ProtectedRoute>
              <AdministrationPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
