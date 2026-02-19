import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["200", "300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "AF BTEC Platform",
  description: "المنصة التعليمية الأولى لطلاب BTEC - سياسات الصحة والسلامة الرقمية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-[family-name:var(--font-tajawal)] antialiased`}>
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
