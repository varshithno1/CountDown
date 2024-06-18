import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./global.css"

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CountDown",
  description: "Website for traking your countdowns",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="./Logo.jpg" type="image/x-icon" />
      </head>
      <body className={lexend.className}>{children}</body>
    </html>
  );
}
