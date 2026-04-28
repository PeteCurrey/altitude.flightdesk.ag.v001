import type { Metadata } from "next";
import { Syne, DM_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "500"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ALTITUDE — UAV Operations Command",
    template: "%s | ALTITUDE",
  },
  description:
    "Premium commercial drone operations management platform. Manage the full UAV job lifecycle from client enquiry to delivery.",
  keywords: ["drone operations", "UAV management", "flight planning", "aerial operations"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${syne.variable} ${dmMono.variable} ${ibmPlexSans.variable} font-sans bg-background text-text-primary antialiased`}>
        <AuthProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
