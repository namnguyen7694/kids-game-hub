import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kids Learn Hub - Chơi Mà Học, Học Mà Chơi!",
  description: "Khám phá thế giới trò chơi giáo dục, rèn luyện tư duy, logic và toán học cho trẻ em.",
  keywords: ["trò chơi trẻ em", "giáo dục", "tư duy logic", "toán học", "memory match", "kids games"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  );
}
