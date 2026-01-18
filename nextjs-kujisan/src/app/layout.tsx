import type { Metadata } from "next";
import "./globals.css";

// 1. Define Global Metadata
export const metadata: Metadata = {
  title: {
    template: '%s | KUJISAN', // %s will be replaced by the specific page title
    default: 'KUJISAN Family Tree', // Fallback title
  },
  description: 'Zuri\'a da Ƴaƴa da Jikoki na BABA Alhaji Sani Abubakar Nadede.',
  openGraph: {
    title: 'KUJISAN Family Tree',
    description: 'The digital family history of Ƙungiyar Jikokin Sani Abubakar Nadede.',
    siteName: 'KUJISAN',
    locale: 'en_NG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}