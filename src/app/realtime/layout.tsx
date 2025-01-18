import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import {
  DM_Sans,
  Inter as FontSans,
  Space_Mono,
  Staatliches,
} from "next/font/google";
import "../globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceMono = Space_Mono({
  subsets: ["latin"], // Choose the subsets you need
  weight: ["400"], // Specify weights (normal, bold, etc.)
});

const dmSans = DM_Sans({
  subsets: ["latin"], // Choose the subsets you need
  weight: ["400"], // Specify weights (normal, bold, etc.)
});

const staatliches = Staatliches({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),
  title: {
    default: "DP",
    template: `%s | ${DATA.name}`,
  },
  description: DATA.description,
  openGraph: {
    title: `${DATA.name}`,
    description: DATA.description,
    url: DATA.url,
    siteName: `${DATA.name}`,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${DATA.name}`,
    card: "summary_large_image",
  },
  verification: {
    google: "",
    yandex: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider delayDuration={0}>
        {/* <Navbar /> */}
        <main
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            dmSans.className
          )}
        >
          {children}
        </main>
      </TooltipProvider>
    </ThemeProvider>
  );
}
