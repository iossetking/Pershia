import type { Metadata } from "next";
import "./globals.css";

import TopNav from "@/components/layout/TopNav";
import Providers from "./providers";

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
      <body className="antialiased h-screen flex flex-col">
        <TopNav />
        <Providers>
          <main className="flex-1 flex flex-col overflow-y-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
