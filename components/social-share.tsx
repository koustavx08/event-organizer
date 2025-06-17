"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Copy, Check, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SocialShareProps {
  url: string
  title: string
  description: string
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
      } catch (error) {
        // User cancelled or error occurred, show manual options
        setShowOptions(true)
      }
    } else {
      setShowOptions(true)
    }
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
  }

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={handleNativeShare}>
        <Share2 className="h-4 w-4 mr-1" />
        Share
      </Button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 z-50"
          >
            <Card className="shadow-lg border-2">
              <CardContent className="p-4 space-y-2 min-w-[200px]">
                <div className="text-sm font-medium text-gray-900 mb-3">Share this event</div>

                <Button variant="ghost" size="sm" onClick={handleCopyLink} className="w-full justify-start">
                  {copied ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(shareUrls.facebook, "_blank")}
                  className="w-full justify-start"
                >
                  <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                  Facebook
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(shareUrls.twitter, "_blank")}
                  className="w-full justify-start"
                >
                  <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                  Twitter
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(shareUrls.linkedin, "_blank")}
                  className="w-full justify-start"
                >
                  <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                  LinkedIn
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(shareUrls.email)}
                  className="w-full justify-start"
                >
                  <Mail className="h-4 w-4 mr-2 text-gray-600" />
                  Email
                </Button>

                <div className="pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOptions(false)}
                    className="w-full text-gray-500"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close options */}
      {showOptions && <div className="fixed inset-0 z-40" onClick={() => setShowOptions(false)} />}
    </div>
  )
}
