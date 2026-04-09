import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Melodix — El bot de música definitivo para Discord",
  description:
    "Melodix trae la mejor música a tu servidor de Discord. Soporte para YouTube, Spotify, SoundCloud, Bandcamp, Twitch y más. Comandos slash modernos, gestión de colas avanzada y experiencia premium.",
  keywords: [
    "bot de música Discord",
    "Discord music bot",
    "Melodix bot",
    "bot Discord YouTube",
    "bot Discord Spotify",
    "bot Discord música gratis",
    "reproducir música Discord",
  ],
  authors: [{ name: "Melodix Team" }],
  creator: "Melodix",
  openGraph: {
    type: "website",
    locale: "es_ES",
    title: "Melodix — El bot de música definitivo para Discord",
    description:
      "Reproduce música de YouTube, Spotify, SoundCloud y más en tu servidor de Discord. Gratis, rápido y fácil de usar.",
    siteName: "Melodix",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Melodix Discord Music Bot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Melodix — Bot de música para Discord",
    description:
      "Reproduce música de YouTube, Spotify, SoundCloud y más en tu servidor de Discord.",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#8b5cf6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-zinc-950 text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
