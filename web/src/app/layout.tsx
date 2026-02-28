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
    default: "논문읽어주는AI - 최신 AI 논문을 5분 만에",
    template: "%s | 논문읽어주는AI",
  },
  description:
    "매일 최신 AI 논문을 5분 만에 이해할 수 있는 한국어 해설. arXiv 논문 리뷰, 핵심 요약, 기술 분석을 제공합니다.",
  keywords: [
    "AI 논문",
    "arXiv",
    "논문 해설",
    "논문 리뷰",
    "인공지능",
    "머신러닝",
    "딥러닝",
    "한국어 논문 요약",
    "LLM",
    "컴퓨터 비전",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://논문읽어주는ai.com",
    siteName: "논문읽어주는AI",
    title: "논문읽어주는AI - 최신 AI 논문을 5분 만에",
    description:
      "매일 최신 AI 논문을 5분 만에 이해할 수 있는 한국어 해설. arXiv 논문 리뷰, 핵심 요약, 기술 분석을 제공합니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "논문읽어주는AI - 최신 AI 논문을 5분 만에",
    description:
      "매일 최신 AI 논문을 5분 만에 이해할 수 있는 한국어 해설. arXiv 논문 리뷰, 핵심 요약, 기술 분석을 제공합니다.",
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
