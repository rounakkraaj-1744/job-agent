import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const notoSansHeading = Noto_Sans({subsets:['latin'],variable:'--font-heading'});

const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JobPilot — Job search workspace",
    template: "%s · JobPilot",
  },
  description:
    "A focused workspace for discovering opportunities and managing your job search.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", nunitoSans.variable, notoSansHeading.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
