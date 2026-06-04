import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import AIChatbot from "@/components/ai-chatbot";

export const metadata: Metadata = {
  title: "CollegeIQ AI - Find Your Perfect College",
  description: "AI-powered college discovery platform helping students find their perfect college with smart recommendations and cutoff analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
          <AIChatbot />
        </Providers>
      </body>
    </html>
  );
}
