import { Open_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata = {
  title: "Ghorer Bazar",
  description: "Mobile first grocery storefront",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} bg-[#efefef] font-sans text-brand-ink`}>
        {children}
      </body>
    </html>
  );
}
