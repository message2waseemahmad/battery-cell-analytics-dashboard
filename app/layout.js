import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Cell Analytics',
  description: 'Battery cell test data analytics dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
