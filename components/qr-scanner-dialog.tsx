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
        setTimeout(() => {
          // Generate a mock QR code value for demo
          const mockQRValue = `rsvp_${eventId}_${Date.now()}`
          processQRCode(mockQRValue)
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

  const simulateQRScan = () => {
    // For demo purposes - simulate scanning a valid QR code
    setScanning(true)
    setTimeout(() => {
      setAttendeeInfo({
        name: "John Doe",
        email: "john@example.com",
        rsvpId: "rsvp_123",
        checkedIn: false,
      })
      setSuccess("Check-in successful!")
      onCheckInSuccess()
      setScanning(false)
    }, 2000)
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
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Ask attendees to show their QR code ticket. Upload an image of the QR code
              or use the demo scanner to check them in.
            </p>
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
