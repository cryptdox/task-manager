import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  console.log("window.location: ", window.location.search)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#00a8ff]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/sign-in${window.location.search}`} replace />;
  }

  return <>{children}</>;
}
