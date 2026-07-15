import Loading from "@/app/[locale]/loading";
import { Navigation } from "@/components/Navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist } from "next/font/google";
import { ReactNode, Suspense } from "react";
import { Footer } from "./Footer";
import StoryblokProvider from "./StoryblokProvider";
import { TooltipProvider } from "./ui/tooltip";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

type Props = {
  children: ReactNode;
  locale: string;
};

export default async function BaseLayout({ children, locale }: Props) {
  const messages = await getMessages();

  return (
    <StoryblokProvider>
      <html
        lang={locale}
        suppressHydrationWarning
        className={`scroll-smooth ${geist.variable}`}
      >
        <body className="antialiased min-h-screen text-black dark:text-white scroll-smooth">
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              enableColorScheme={false}
            >
              <TooltipProvider delayDuration={0}>
                <div className="relative flex min-h-screen flex-col bg-background">
                  <div className="mx-auto w-full border-border/40 dark:border-border min-[1800px]:max-w-[1536px] min-[1800px]:border-x">
                    <Navigation />
                    <main className="flex-1 overflow-y-auto">
                      <div className="container mx-auto min-h-[calc(100vh-57px)] md:min-h-[calc(100vh-80px)] pt-8 p-4 flex flex-col">
                        <Suspense fallback={<Loading />}>{children}</Suspense>
                        <SpeedInsights />
                        <Analytics />
                      </div>
                    </main>

                    <Footer />
                  </div>
                </div>
              </TooltipProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </StoryblokProvider>
  );
}
