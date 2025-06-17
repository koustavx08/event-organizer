"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"

const rsvpSchema = yup.object({
  name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().required("Email is required").email("Please enter a valid email"),
  phone: yup.string().optional(),
  notes: yup.string().optional(),
})

type RSVPFormData = yup.InferType<typeof rsvpSchema>

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

interface RSVPDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event
  onRSVPSuccess: (rsvp: RSVP) => void
}

export function RSVPDialog({ open, onOpenChange, event, onRSVPSuccess }: RSVPDialogProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RSVPFormData>({
    resolver: yupResolver(rsvpSchema),
  })

  const onSubmit = async (data: RSVPFormData) => {
    setLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Please log in to RSVP")
        setLoading(false)
        return
      }

      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
          ...data,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        onRSVPSuccess(result.rsvp)
        setTimeout(() => {
          onOpenChange(false)
          setSuccess(false)
          reset()
        }, 2000)
      } else {
        setError(result.message || "Failed to RSVP")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setError("")
    setSuccess(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>RSVP to Event</DialogTitle>
          <DialogDescription>Reserve your spot for "{event.name}"</DialogDescription>
        </DialogHeader>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">RSVP Confirmed!</h3>
            <p className="text-gray-600">
              Your ticket has been generated. You can view it anytime from the event page.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter your full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" {...register("phone")} placeholder="Enter your phone number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea id="notes" {...register("notes")} placeholder="Any special requirements or notes..." rows={3} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm RSVP"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
