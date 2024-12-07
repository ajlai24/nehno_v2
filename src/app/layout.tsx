import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Nehno",
  description: "A sofware developer's playground site for experimentation",
};

const year = new Date().getFullYear();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            <div className="mx-auto w-full border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x">
              <Navigation />
              <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto min-h-[calc(100vh-3.5rem)]">
                  {children}
                </div>
              </main>
              <footer className="border-t border-border/40 py-6 dark:border-border md:px-8 md:py-0">
                <div className="text-xs text-neutral-500 dark:text-neutral-400 container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  &copy; {year} nehno.com
                </div>
              </footer>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
