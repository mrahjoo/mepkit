import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { GlobalBreadcrumbs } from "@/components/navigation/Breadcrumbs";
import Link from "next/link";
import { Hexagon } from "lucide-react";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MEPKit | Mechanical, Electrical, and Plumbing Engineering Toolbox",
  description: "The ultimate reference and toolkit for MEP professionals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} font-sans h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4361471674734210"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center">
            <Link href="/" className="flex items-center space-x-2 mr-6">
              <Hexagon className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg hidden sm:inline-block">MEPKit</span>
            </Link>
            <div className="flex-1" />
            {/* Future header links can go here */}
          </div>
          <div className="border-t bg-muted/20">
            <GlobalBreadcrumbs />
          </div>
        </header>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
