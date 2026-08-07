import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "sgprojectastar",
  description: "AI에게 곧장 답을 구하기 전에, 스스로 생각할 기회를 돌려주는 되묻기 대화형 웹서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
