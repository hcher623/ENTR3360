import '../styles.css';
import { ProfileProvider } from './context/ProfileContext';
import { AuthProvider } from './context/AuthContext';
import SessionWrapper from './components/SessionWrapper';
import NavHeader from './components/NavHeader';
import ResetModal from './components/ResetModal';
import ToastNotification from './components/ToastNotification';

export const metadata = {
  title: 'Myrimaven — Career Discovery Platform',
  description: 'An interactive platform discovering career paths that genuinely fit who you are. Differentiated matching, honest trade-offs, and no test pressure.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" 
          rel="stylesheet" 
        />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧭</text></svg>" />
      </head>
      <body>
        <SessionWrapper>
        <AuthProvider>
        <ProfileProvider>
          <NavHeader />
          <main className="app-container">
            {children}
          </main>
          <ResetModal />
          <ToastNotification />
        </ProfileProvider>
        </AuthProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
