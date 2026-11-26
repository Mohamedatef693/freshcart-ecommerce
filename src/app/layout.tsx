import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_components/Navbar/Navbar";
import Footer from "./_components/Footer/Footer";

export const metadata: Metadata = {
  title: {
    default: "FreshCart | Everyday shopping made easier",
    template: "%s | FreshCart",
  },
  description: "Discover fresh picks and everyday essentials at FreshCart.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
