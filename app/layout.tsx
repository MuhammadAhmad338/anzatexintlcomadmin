import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/header";
import Footer from "./components/footer";
import { Poppins } from "next/font/google";
import Sidebar from "./components/sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Anzatexintladmin",
  description: "Garments & Cosmetics"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="min-h-screen bg-neutral-50">
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex flex-1"> 
            <Sidebar />
            <main className="flex-1 p-6">{children}</main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}

