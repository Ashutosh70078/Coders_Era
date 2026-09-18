import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PassModalProvider } from "@/context/PassModalContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Automate India NIET Chapter | CodersEra",
  description: "Scoreboard & Evaluation Results for the GenAI & Blockchain Hackathon organized by Coders Era & Hack Briven supported by Microsoft Azure at Seminar Hall, NIET.",
  keywords: ["CodersEra", "Automate India", "NIET", "Hackathon Scoreboard", "Virtual Pass", "GenAI", "Microsoft Azure", "Student Developers"],
  authors: [{ name: "CodersEra Community" }],
  icons: {
    icon: "/codersera-logo-original.jpg",
    apple: "/codersera-logo-original.jpg",
  },
  openGraph: {
    title: "CodersEra | Automate India NIET Chapter Leaderboard",
    description: "Official Hackathon Scoreboard & Evaluation Results for Automate India NIET Chapter 2026.",
    url: "https://www.codersera.in/events/automate-india-leaderboard",
    siteName: "CodersEra",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodersEra | Automate India NIET Chapter Leaderboard",
    description: "Official Hackathon Scoreboard & Evaluation Results for Automate India NIET Chapter 2026.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="stylesheet" href="/codersera-official.css" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground antialiased min-h-screen flex flex-col selection:bg-primary/20`}>
        <PassModalProvider>
          {/* Background Ambient Glow Orbs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[140px] rounded-full" />
            <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full" />
            <div className="absolute top-2/3 left-10 w-[400px] h-[400px] bg-cyan-500/10 blur-[120px] rounded-full" />
          </div>

          {/* Global CodersEra Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="flex-1 w-full relative z-20">
            {children}
          </main>

          {/* Global CodersEra Footer */}
          <Footer />

          {/* Toast Notifications */}
          <Toaster 
            theme="dark" 
            position="top-right" 
            toastOptions={{
              style: {
                background: "#121215",
                border: "1px solid #27272a",
                color: "#fafafa",
              }
            }}
          />
        </PassModalProvider>
      </body>
    </html>
  );
}
