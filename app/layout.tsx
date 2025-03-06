// app/layout.tsx
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | User Management Dashboard",
    default: "User Management Dashboard",
  },
  description:
    "A Next.js 15 user management dashboard with authentication and CRUD functionality",
  keywords: ["next.js", "dashboard", "user management", "admin panel"],
  robots: "index, follow",
  openGraph: {
    title: "User Management Dashboard",
    description:
      "A Next.js 15 user management dashboard with authentication and CRUD functionality",
    url: "https://user-management-dashboard.example.com",
    siteName: "User Management Dashboard",
    // images: [
    //   {
    //     url: "https://user-management-dashboard.example.com/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "User Management Dashboard",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
