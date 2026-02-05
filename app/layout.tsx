import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import ReduxProvider from "./providers/providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"]
});

export const metadata: Metadata = {
  title: "Anzatexintladmin",
  description: "Garments & Cosmetics"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="min-h-screen bg-neutral-50">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
