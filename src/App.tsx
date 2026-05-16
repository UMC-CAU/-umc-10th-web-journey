import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import MyPage from './pages/MyPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import LpListPage from './pages/LpListPage';
import LpDetailPage from './pages/LpDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      // Public Route
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'v1/auth/google/callback', element: <GoogleCallbackPage /> },
      { path: 'v1/lps', element: <LpListPage /> },

      // Protected Route
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'mypage', element: <MyPage /> },
          { path: 'lp/:lpid', element: <LpDetailPage /> },
        ],
      },
    ],
  },
]);

import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}