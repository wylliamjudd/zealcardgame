import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AudioProvider } from './components/AudioContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import MainLayout from './layouts/MainLayout';
import Home from './components/Home';
import BlogPage from './components/BlogPage';
import Store from './pages/Store';
import AuthCallback from './pages/AuthCallback';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfUse from './pages/Legal/TermsOfUse';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'store', element: <Store /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-of-use', element: <TermsOfUse /> },
    ],
  },
  // Auth callback route for handling OAuth redirects
  {
    path: '/auth/callback',
    element: <AuthCallback />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <AudioProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </AudioProvider>
      </ToastProvider>
    </HelmetProvider>
  </React.StrictMode>
);

