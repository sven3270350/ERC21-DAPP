import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "@/context/Providers";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Toaster } from "sonner";

const myFont = localFont({
  src: "../../assets/fonts/Satoshi-Variable.ttf",
  display: "auto",
});

export const metadata: Metadata = {
  title: "ERC21",
  description: "ERC21 bot",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
    },
  },
  openGraph: {
    images: "/opengraph-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${myFont.className} bg-[#09090B] text-white `}>
        <Providers>{children}</Providers>
        <Toaster richColors theme="system" />
      </body>
    </html>
  );
}
