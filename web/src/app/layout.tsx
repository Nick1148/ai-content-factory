import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

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
    default: "AI Tool Radar - AI 도구 디렉토리 & 리뷰",
    template: "%s | AI Tool Radar",
  },
  description:
    "매일 새로운 AI 도구를 발견하세요. 최신 AI 도구 리뷰, 비교, 트렌드를 한눈에 확인할 수 있습니다.",
  keywords: [
    "AI tools",
    "AI 도구",
    "인공지능",
    "AI directory",
    "AI review",
    "ChatGPT",
    "Midjourney",
    "AI 추천",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://aitoolradar.com",
    siteName: "AI Tool Radar",
    title: "AI Tool Radar - AI 도구 디렉토리 & 리뷰",
    description:
      "매일 새로운 AI 도구를 발견하세요. 최신 AI 도구 리뷰, 비교, 트렌드를 한눈에 확인할 수 있습니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tool Radar - AI 도구 디렉토리 & 리뷰",
    description:
      "매일 새로운 AI 도구를 발견하세요. 최신 AI 도구 리뷰, 비교, 트렌드를 한눈에 확인할 수 있습니다.",
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
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
