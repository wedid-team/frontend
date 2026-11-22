import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WEDID",
  description: "우리의 결혼 준비를 함께 관리해요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
