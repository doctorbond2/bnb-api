import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'bnb-api-server',
  description: 'bnb-api-server',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
  console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET);
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
