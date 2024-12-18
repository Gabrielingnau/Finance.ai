import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Finance.ai",
  description: `A Finance AI é uma plataforma de gestão financeira que utiliza IA para
  monitorar suas movimentações, e oferecer insights personalizados,
  facilitando o controle do seu orçamento.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Finance.ai</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${mulish.className} dark antialiased`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <div className="flex h-full flex-col overflow-hidden">{children}</div>
        </ClerkProvider>
      </body>
    </html>
  );
}
