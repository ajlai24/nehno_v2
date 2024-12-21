import BaseLayout from "@/components/BaseLayout";
import { Locale, routing } from "@/i18n/routing";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import "../globals.css";

export const metadata: Metadata = {
  title: "Nehno",
  description: "A sofware developer's playground site for experimentation",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
