"use client"

import { QRCodeSVG } from "qrcode.react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, Download, CheckCircle, Clock } from "lucide-react"

interface Event {
  _id: string
  name: string
  date: string
  location: string
}

interface RSVP {
  _id: string
  eventId: string
  userId: string
  userName: string
  userEmail: string
  status: "confirmed" | "cancelled"
  checkedIn: boolean
  qrCode: string
  createdAt: string
}

interface QRTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rsvp: RSVP
  event: Event
}

export function QRTicketDialog({ open, onOpenChange, rsvp, event }: QRTicketDialogProps) {
  const eventDate = new Date(event.date)

  const downloadTicket = () => {
    // Create a canvas to generate the ticket image
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 600

    // Draw ticket background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw border
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    // Add text content
    ctx.fillStyle = "#111827"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("EVENT TICKET", canvas.width / 2, 60)

    ctx.font = "18px Arial"
    ctx.fillText(event.name, canvas.width / 2, 100)

    ctx.font = "14px Arial"
    ctx.fillText(eventDate.toLocaleDateString(), canvas.width / 2, 130)
    ctx.fillText(event.location, canvas.width / 2, 150)

    // Download the image
    const link = document.createElement("a")
    link.download = `ticket-${event.name.replace(/\s+/g, "-").toLowerCase()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Event Ticket</DialogTitle>
          <DialogDescription>Present this QR code at the event for check-in</DialogDescription>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-6">
              {/* Ticket Header */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EVENT TICKET</h3>
                <Badge className={rsvp.checkedIn ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                  {rsvp.checkedIn ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Checked In
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Not Checked In
                    </>
                  )}
                </Badge>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <QRCodeSVG value={rsvp.qrCode} size={150} level="M" includeMargin={false} />
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium">{event.name}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  <span>
                    {eventDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span>{rsvp.userName}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Ticket ID */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Ticket ID</p>
                <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{rsvp._id.slice(-8).toUpperCase()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={downloadTicket} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Present this QR code to the event organizer for check-in. Keep this ticket
              safe and accessible on your device.
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
