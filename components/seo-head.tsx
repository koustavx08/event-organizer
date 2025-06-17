"use client"

import Head from "next/head"

interface SEOHeadProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: "website" | "article" | "event"
  eventData?: {
    startDate: string
    endDate?: string
    location: string
    organizer: string
  }
}

export function SEOHead({ title, description, image, url, type = "website", eventData }: SEOHeadProps) {
  const siteTitle = "EventHub"
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const defaultImage = "/og-image.png"
  const imageUrl = image || defaultImage

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Event-specific structured data */}
      {type === "event" && eventData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: title,
              description: description,
              image: imageUrl,
              startDate: eventData.startDate,
              endDate: eventData.endDate || eventData.startDate,
              location: {
                "@type": "Place",
                name: eventData.location,
              },
              organizer: {
                "@type": "Organization",
                name: eventData.organizer,
              },
              url: url,
            }),
          }}
        />
      )}
    </Head>
  )
}
