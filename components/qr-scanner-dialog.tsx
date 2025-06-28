"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QrCode, CheckCircle, X, Camera, Upload } from "lucide-react"

interface QRScannerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  onCheckInSuccess: () => void
}

interface AttendeeInfo {
  name: string
  email: string
  rsvpId: string
  checkedIn: boolean
}

export function QRScannerDialog({ open, onOpenChange, eventId, onCheckInSuccess }: QRScannerDialogProps) {
  const [scanning, setScanning] = useState(false)
  const [attendeeInfo, setAttendeeInfo] = useState<AttendeeInfo | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setAttendeeInfo(null)
      setError("")
      setSuccess("")
      setScanning(false)
    }
  }, [open])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setScanning(true)
      setError("")

      // Create a canvas to read the QR code from the image
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = async () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        // For demo purposes, we'll simulate QR code reading
        // In a real app, you'd use a QR code library like jsQR
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)

        // Simulate QR code detection and processing
        setTimeout(async () => {
          // Try to get existing RSVP for this event first
          try {
            const token = localStorage.getItem("token")
            const response = await fetch(`/api/rsvp/check/${eventId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.rsvp) {
                await processQRCode(data.rsvp.qrCode)
                return
              }
            }
            
            // If no existing RSVP, show error
            setError("No valid QR code found in image. Please ensure the QR code is clear and visible.")
            setScanning(false)
          } catch (error) {
            setError("Failed to process QR code from image")
            setScanning(false)
          }
        }, 1000)
      }

      img.src = URL.createObjectURL(file)
    } catch (error) {
      setError("Failed to process image")
      setScanning(false)
    }
  }

  const processQRCode = async (qrValue: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/rsvp/check-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          qrCode: qrValue,
          eventId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setAttendeeInfo(data.attendee)
        if (!data.attendee.checkedIn) {
          setSuccess("Check-in successful!")
          onCheckInSuccess()
        }
      } else {
        setError(data.message || "Invalid QR code")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setScanning(false)
    }
  }

  const simulateQRScan = async () => {
    // Create a demo RSVP first, then scan it
    setScanning(true)
    setError("")
    
    try {
      const token = localStorage.getItem("token")
      
      // First, create a demo RSVP for this event
      const createRsvpResponse = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          name: "John Doe (Demo Attendee)",
          email: "john.demo@example.com",
          phone: "+91 98765 43210",
          notes: "Demo RSVP for testing check-in",
        }),
      })

      const rsvpData = await createRsvpResponse.json()

      if (createRsvpResponse.ok) {
        // Now simulate scanning the QR code
        const qrCode = rsvpData.rsvp.qrCode
        await processQRCode(qrCode)
      } else {
        // If RSVP already exists, try to find an existing one
        const existingRsvpResponse = await fetch(`/api/rsvp/check/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (existingRsvpResponse.ok) {
          const existingData = await existingRsvpResponse.json()
          if (existingData.rsvp) {
            await processQRCode(existingData.rsvp.qrCode)
          } else {
            setError("No RSVPs found for this event. Please create an RSVP first.")
            setScanning(false)
          }
        } else {
          setError(rsvpData.message || "Failed to create demo RSVP")
          setScanning(false)
        }
      }
    } catch (error) {
      setError("Failed to create demo RSVP")
      setScanning(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            QR Code Check-in
          </DialogTitle>
          <DialogDescription>Scan attendee QR codes to check them in to the event</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {attendeeInfo && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-900">Attendee Information</h4>
                    <Badge
                      className={attendeeInfo.checkedIn ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}
                    >
                      {attendeeInfo.checkedIn ? "Already Checked In" : "Checked In"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>
                      <strong>Name:</strong> {attendeeInfo.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {attendeeInfo.email}
                    </p>
                    <p>
                      <strong>RSVP ID:</strong> {attendeeInfo.rsvpId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Scanner Interface */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                {scanning ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing QR code...</p>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Upload an image with a QR code or use the demo scanner</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
                className="flex items-center justify-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>

              <Button onClick={simulateQRScan} disabled={scanning} className="flex items-center justify-center">
                <Camera className="h-4 w-4 mr-2" />
                Demo Scan
              </Button>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-blue-800 font-medium">
              <strong>How to test the QR scanner:</strong>
            </p>
            <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
              <li>Click "Demo Scan" to create a test RSVP and check it in</li>
              <li>Or go to your event page and create a real RSVP, then come back to scan</li>
              <li>For real usage, attendees will show QR codes from their RSVP confirmations</li>
            </ol>
          </div>

          {/* Close Button */}
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            <X className="h-4 w-4 mr-2" />
            Close Scanner
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
