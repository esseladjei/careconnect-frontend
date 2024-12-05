import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { Plus_Jakarta_Sans, Roboto } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});
export const metadata: Metadata = {
  title: "careconnect app",
  description: "Developed by Careconnect Inc, Ghana",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={`${jakarta.className} ${roboto.className}`}>
      <body className="bg-white text-gray-500">
        <AuthProvider >
          <Header />
          <section className="p-8 my-auto dark: bg-gray-200">
            {children}
          </section>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
