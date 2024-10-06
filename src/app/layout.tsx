import type { Metadata } from 'next';
import './globals.css';
import UserContextProvider from '@/context/UserContext';
import FooterLayout from '@/components/client/footer/FooterLayout';
export const metadata: Metadata = {
  title: 'Chatup-plus',
  description: 'Next version of chatup application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UserContextProvider>
          <header></header>

          {children}

          <FooterLayout />
        </UserContextProvider>
      </body>
    </html>
  );
}
