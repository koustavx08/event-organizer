import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"

export const metadata: Metadata = {
  title: "Kolkata Events - Discover Amazing Events in the City of Joy",
  description:
    "Find and organize events in Kolkata, West Bengal. From cultural festivals to tech conferences, discover what's happening in the City of Joy.",
  keywords: "Kolkata events, West Bengal events, City of Joy, cultural festivals, tech conferences, Durga Puja",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <ChatbotWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
