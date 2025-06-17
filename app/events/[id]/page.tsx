"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, MapPin, User, ArrowLeft, Heart, Users, CheckCircle, Clock, XCircle, Star, Tag } from "lucide-react"
import { RSVPDialog } from "@/components/rsvp-dialog"
import { QRTicketDialog } from "@/components/qr-ticket-dialog"
import { SEOHead } from "@/components/seo-head"
import { SocialShare } from "@/components/social-share"
import { ThemeToggle } from "@/components/theme-toggle"

interface Event {
  _id: string
  name: string
  date: string
  location: string
  area: string
  description: string
  category: string
  image?: string
  organizer: string
  organizerName?: string
  status: "upcoming" | "completed" | "cancelled"
  createdAt: string
  rsvpCount?: number
  featured?: boolean
  tags?: string[]
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

export default function KolkataEventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [userRSVP, setUserRSVP] = useState<RSVP | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [rsvpDialogOpen, setRsvpDialogOpen] = useState(false)
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string)
      checkUserRSVP(params.id as string)
    }
  }, [params.id])

  const fetchEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data.event)
      } else {
        setError("Event not found")
      }
    } catch (error) {
      setError("Error loading event")
    } finally {
      setLoading(false)
    }
  }

  const checkUserRSVP = async (eventId: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await fetch(`/api/rsvp/check/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUserRSVP(data.rsvp)
      }
    } catch (error) {
      console.error("Error checking RSVP:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading event details...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md border-orange-100">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
              <p className="text-gray-600 mb-4">
                The event you're looking for doesn't exist or has been removed.
              </p>
              <Link href="/events">
                <Button className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700">
                  Browse Other Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const isUpcoming = event.status === "upcoming"
  const eventDate = new Date(event.date)
  const canRSVP = isUpcoming && !userRSVP
  const hasRSVP = userRSVP && userRSVP.status === "confirmed"

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      <SEOHead
        title={`${event.name} - Kolkata Events`}
        description={`${event.description} | Event in ${event.area}, Kolkata`}
        image={event.image}
        url={typeof window !== "undefined" ? window.location.href : ""}
        type="event"
        eventData={{
          startDate: event.date,
          location: `${event.location}, ${event.area}, Kolkata, West Bengal`,
          organizer: event.organizerName || event.organizer,
        }}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600 mr-2" />
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                  Kolkata Events
                </h1>
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/events"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Browse Events
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Dashboard
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Event Image */}
        {event.image && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="relative">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.name}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
              {event.featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-orange-600 to-green-600 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured Event
                  </Badge>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 mb-6 border border-orange-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800"
                  >
                    {event.category}
                  </Badge>
                  {getStatusBadge(event.status)}
                  {event.featured && (
                    <Badge className="bg-gradient-to-r from-orange-600 to-green-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <SocialShare
                    url={typeof window !== "undefined" ? window.location.href : ""}
                    title={event.name}
                    description={event.description}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-500" />
                  <span>
                    {eventDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {eventDate.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                  <span>{event.area}, Kolkata</span>
                </div>
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Organized by {event.organizerName || event.organizer}</span>
                </div>
                {event.rsvpCount !== undefined && (
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-500" />
                    <span>{event.rsvpCount} attending</span>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-orange-200 text-orange-700"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Maps Embed */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                  Event Location
                </h3>
                <div className="aspect-video rounded-lg overflow-hidden shadow-md border border-orange-100">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1234567890!2d88.3639!3d22.5726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(event.location + ", " + event.area + ", Kolkata")}!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map showing ${event.location}, ${event.area}, Kolkata`}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  📍 {event.location}, {event.area}, Kolkata, West Bengal
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="sticky top-24 border-orange-100">
              <CardHeader>
                <CardTitle className="text-lg">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Date & Time</h4>
                  <p className="text-gray-600">
                    {eventDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-600">
                    {eventDate.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {getStatusBadge(event.status)}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <p className="text-gray-600">{event.location}</p>
                  <p className="text-sm text-orange-600">{event.area}, Kolkata</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800"
                  >
                    {event.category}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Organizer</h4>
                  <p className="text-gray-600">{event.organizerName || event.organizer}</p>
                </div>

                {event.rsvpCount !== undefined && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Attendees</h4>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.rsvpCount} people attending</span>
                      </div>
                    </div>
                  </>
                )}

                {/* RSVP Actions */}
                {isUpcoming && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      {canRSVP && (
                        <Button
                          className="w-full bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700"
                          size="lg"
                          onClick={() => setRsvpDialogOpen(true)}
                        >
                          RSVP to Event
                        </Button>
                      )}

                      {hasRSVP && (
                        <div className="space-y-2">
                          <Alert className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              You're registered for this event!
                            </AlertDescription>
                          </Alert>
                          <Button
                            variant="outline"
                            className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                            onClick={() => setTicketDialogOpen(true)}
                          >
                            View My Ticket
                          </Button>
                        </div>
                      )}

                      {!canRSVP && !hasRSVP && (
                        <p className="text-xs text-gray-500 text-center">
                          RSVP is not available for this event
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* RSVP Dialog */}
      <RSVPDialog
        open={rsvpDialogOpen}
        onOpenChange={setRsvpDialogOpen}
        event={event}
        onRSVPSuccess={(rsvp) => {
          setUserRSVP(rsvp)
          setEvent((prev) => (prev ? { ...prev, rsvpCount: (prev.rsvpCount || 0) + 1 } : null))
        }}
      />

      {/* QR Ticket Dialog */}
      {userRSVP && (
        <QRTicketDialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen} rsvp={userRSVP} event={event} />
      )}
    </div>
  )
}
