import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "KASEDA — Kalam Se Kapada | Premium Streetwear",
  description: "Join the founding community of KASEDA. Premium streetwear and everyday essentials designed for those who believe fashion is a form of self-expression.",
  keywords: ["KASEDA", "Kalam Se Kapada", "Luxury Streetwear", "Premium Basics", "Minimalist Fashion", "Founding Members"],
  openGraph: {
    title: "KASEDA — Kalam Se Kapada",
    description: "Premium streetwear and everyday essentials designed for those who believe fashion is a form of self-expression.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}


