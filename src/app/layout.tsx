import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "데이터 표현 100가지 방법",
  description:
    "프론트엔드 개발자를 위한 데이터 시각화 예제와 인사이트를 공유하는 블로그",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">{children}</div>
      </body>
    </html>
  );
}
