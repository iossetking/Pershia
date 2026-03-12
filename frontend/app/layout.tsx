import type { Metadata } from "next";
import "./globals.css";

import TopNav from "@/components/layout/TopNav";

export const metadata: Metadata = {
  title: "Pershia",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
