import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Alex Play — магазин приложений',
  description:
    'Alex Play — кроссплатформенный магазин приложений для iPhone и Android: игры, инструменты, AI, фото и многое другое.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0F1A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
