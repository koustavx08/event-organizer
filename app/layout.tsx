import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget"
import ErrorBoundary from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "Kolkata Events - Discover Amazing Events in the City of Joy",
  description:
    "Find and organize events in Kolkata, West Bengal. From cultural festivals to tech conferences, discover what's happening in the City of Joy.",
  keywords: "Kolkata events, West Bengal events, City of Joy, cultural festivals, tech conferences, Durga Puja",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent extension errors from affecting the application
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('param') && e.message.includes('not legal')) {
                  e.preventDefault();
                  return false;
                }
              });
              
              // Suppress console errors from extensions
              const originalError = console.error;
              console.error = function(...args) {
                const message = args.join(' ');
                if (message.includes('param') && message.includes('not legal')) {
                  return;
                }
                if (message.includes('MetaMask extension not found')) {
                  return;
                }
                originalError.apply(console, args);
              };
            `,
          }}
        />
      </head>
      <body className="min-h-screen gradient-bg font-sans antialiased">
        <ErrorBoundary>
          {children}
          <ChatbotWidget />
        </ErrorBoundary>
      </body>
    </html>
  )
}
