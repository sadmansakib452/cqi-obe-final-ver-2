// src/app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "../providers/theme-provider";
import { CourseFileProvider } from "./dashboard/courseFiles/_components/context/CourseFileContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`,
  ),
  title: "Course File Archiver - East West University",
  description:
    "Course File Archiver is a Next.js platform for East West University, designed for efficient academic file management with secure MinIO storage.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "Course File Archiver - East West University",
    description:
      "An academic file management platform developed with Next.js and MinIO, facilitating secure and organized course file storage for East West University.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Course File Archiver - East West University",
    description:
      "Efficient academic file management for East West University, built with Next.js and MinIO for secure, scalable course file storage.",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CourseFileProvider>
              {" "}
              {/* Wrap with CourseFileProvider */}
              {children}
            </CourseFileProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
