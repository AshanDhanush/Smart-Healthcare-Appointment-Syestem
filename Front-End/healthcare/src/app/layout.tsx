import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
<<<<<<< Updated upstream
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
<<<<<<< HEAD
=======
import { AuthProvider } from "@/context/AuthContext";
>>>>>>> Stashed changes
=======
import { AuthProvider } from "@/context/AuthContext";
>>>>>>> a152ae2f5bc4ad09727051a093c360dda90b5331

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
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
        <AuthProvider>
>>>>>>> a152ae2f5bc4ad09727051a093c360dda90b5331
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
<<<<<<< HEAD
=======
        <AuthProvider>
        <main className="flex-grow">
          {children}
        </main>
        </AuthProvider>
>>>>>>> Stashed changes
=======
        </AuthProvider>
>>>>>>> a152ae2f5bc4ad09727051a093c360dda90b5331
      </body>
    </html>
  );
}
