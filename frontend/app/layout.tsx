import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee Directory",
  description: "A simple employee management application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
