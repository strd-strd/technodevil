import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

const roboto = Roboto_Condensed({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-roboto",
  display: "swap",
});

const corporate = localFont({
  src: "../public/fonts/Corporate-A-Bold.woff2",
  weight: "700",
  variable: "--font-corporate",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "TECHNODEVIL",
  description:
    "Live Dj band from Nizhniy Novgorod. Infernal Techno — живой ритм и индустриальные синтезаторы.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${roboto.variable} ${corporate.variable}`}>
      <body>{children}</body>
    </html>
  );
}
