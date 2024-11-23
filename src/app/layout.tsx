import type { Metadata } from "next";
import { Inter, Staatliches, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });
const staatliches = Staatliches({
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  subsets: ['latin'], // Choose the subsets you need
  weight: ['400'], // Specify weights (normal, bold, etc.)
});

export const metadata: Metadata = {
  title: "Dynamic Portfolio",
  description: "Instant Insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={staatliches.className}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
