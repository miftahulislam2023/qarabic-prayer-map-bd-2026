import { Analytics } from '@vercel/analytics/react';
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-hind-siliguri",
});

export const metadata = {
  title: "Bangladesh Prayer Times Map",
  description: "Bangladesh Prayer Times of 64 Districts - ৬৪ জেলার নামাজের সময়সূচি",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${hindSiliguri.variable} antialiased font-sans`}
        style={{ fontFamily: 'var(--font-hind-siliguri)' }}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
