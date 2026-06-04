import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import AIChatbot from "@/components/ai-chatbot";

const SITE_URL = "https://collegeiq-ai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CollegeIQ AI — Find Your Perfect College",
    template: "%s | CollegeIQ AI",
  },
  description:
    "AI-powered college discovery platform for Indian students. Get Safe/Target/Dream college recommendations based on your MHT-CET, JEE Main, or JEE Advanced score. Compare colleges, check cutoffs, and chat with an AI counselor.",
  keywords: [
    "college admission", "MHT-CET", "JEE Main", "JEE Advanced",
    "college recommendations", "cutoff predictor", "NIRF ranking",
    "engineering colleges India", "AI counselor", "CollegeIQ",
  ],
  authors: [{ name: "Mayur Dongare", url: "https://github.com/mayurdongare269" }],
  creator: "Mayur Dongare",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "CollegeIQ AI",
    title: "CollegeIQ AI — Find Your Perfect College",
    description:
      "AI-powered college discovery. Get personalised Safe/Target/Dream college lists based on your exam score, category, and preferences.",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "CollegeIQ AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CollegeIQ AI — Find Your Perfect College",
    description: "AI-powered college discovery for Indian engineering students.",
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
