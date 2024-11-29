import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";


export const metadata: Metadata = {
  title: "careconnect app",
  description: "Developed by Careconnect Inc, Ghana",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className="bg-white">
        <Header />
        <section className="p-8 my-auto dark: bg-gray-200">
          {children}
        </section>
        <Footer />
      </body>
    </html>
  );
}
