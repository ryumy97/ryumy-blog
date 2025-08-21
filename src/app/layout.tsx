import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TransitionIn, TransitionOut } from "@/components/TransitionTunnel";
import SmoothScroll from "@/components/SmoothScroll";

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
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen">
            <Header />
            <main>
              {children}
              <TransitionOut />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
