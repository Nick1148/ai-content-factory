import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-content-factory.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "AI Content Factory - 자동화 콘텐츠 파이프라인",
    template: "%s | AI Content Factory",
  },
  description:
    "AI 도구 수집, 리뷰 생성, 멀티 플랫폼 발행을 완전 자동화하는 오픈소스 콘텐츠 파이프라인. $0 운영비로 매일 콘텐츠를 자동 생산합니다.",
  keywords: [
    "AI Content Factory",
    "AI content automation",
    "AI 콘텐츠 자동화",
    "content pipeline",
    "AI tools",
    "AI 도구 리뷰",
    "automated publishing",
    "open source",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "AI Content Factory",
    title: "AI Content Factory - 자동화 콘텐츠 파이프라인",
    description:
      "AI 도구 수집, 리뷰 생성, 멀티 플랫폼 발행을 완전 자동화하는 오픈소스 콘텐츠 파이프라인.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Content Factory - 자동화 콘텐츠 파이프라인",
    description:
      "AI 도구 수집, 리뷰 생성, 멀티 플랫폼 발행을 완전 자동화하는 오픈소스 콘텐츠 파이프라인.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
