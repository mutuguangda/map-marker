import type { Metadata } from "next";
import { Noto_Serif_SC as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ['400','600','900']
})
export const metadata: Metadata = {
  title: "King Judd's Map",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={cn(
        'min-h-screen font-sans antialiased',
        fontSans.variable
      )}>
        <main>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
