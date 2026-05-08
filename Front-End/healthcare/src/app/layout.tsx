import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
<<<<<<< Updated upstream
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
=======
import { AuthProvider } from "@/context/AuthContext";
>>>>>>> Stashed changes

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HealthSync - Smart Healthcare Appointment System",
  description: "Book your medical appointments seamlessly with our modern healthcare platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">
<<<<<<< Updated upstream
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
=======
        <AuthProvider>
        <main className="flex-grow">
          {children}
        </main>
        </AuthProvider>
>>>>>>> Stashed changes
      </body>
    </html>
  );
}
