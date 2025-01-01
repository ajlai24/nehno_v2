import BaseLayout from "@/components/BaseLayout";
import ClientQueryProvider from "@/components/ClientQueryProvider";
import { Locale, routing } from "@/i18n/routing";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import "../globals.css";

export const metadata: Metadata = {
  title: "Nehno",
  description: "A sofware developer's playground site for experimentation",
  openGraph: {
    title: "Nehno",
    description: "A sofware developer's playground site for experimentation",
    url: "https://nehno.com",
    siteName: "Nehno",
    images: [
      {
        url: "https://nehno.com/api/og",
        width: 800,
        height: 400,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <ClientQueryProvider>
      <BaseLayout locale={locale}>{children}</BaseLayout>
    </ClientQueryProvider>
  );
}
