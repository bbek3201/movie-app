import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Navigation } from "@/app/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Мovie",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
