"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Users,
  Eye,
  LogOut,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { QRScannerDialog } from "@/components/qr-scanner-dialog"

interface Event {
  _id: string
  name: string
  date: string
  location: string
  description: string
  category: string
  image?: string
  organizer: string
  status: "upcoming" | "completed" | "cancelled"
  createdAt: string
  rsvpCount: number
  checkedInCount: number
}

interface User {
  id: string
  name: string
  email: string
}

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchEvents()
  }, [router])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/events/my-events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      } else if (response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setEvents(events.filter((event) => event._id !== eventId))
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const openScanner = (eventId: string) => {
    setSelectedEventId(eventId)
    setScannerOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
            <Clock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200 font-medium">
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
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  const totalRSVPs = events.reduce((sum, event) => sum + (event.rsvpCount || 0), 0)
  const totalCheckedIn = events.reduce((sum, event) => sum + (event.checkedInCount || 0), 0)
  const upcomingEvents = events.filter((event) => event.status === "upcoming")

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="relative p-2 bg-gradient-to-br from-orange-100 to-green-100 rounded-xl mr-3">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent">Kolkata Events</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Welcome, {user?.name}</span>
              <Link href="/events">
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 font-medium shadow-sm"
                >
                  Browse Events
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">My Dashboard</h2>
          <p className="text-xl text-gray-700">Manage your events and track their performance</p>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-orange-400 to-green-400 rounded-full"></div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="gradient-card border-orange-200/50 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Events</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{events.length}</div>
              <p className="text-sm text-gray-600 mt-1">Events you've created</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-orange-200/50 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Total RSVPs</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalRSVPs}</div>
              <p className="text-sm text-gray-600 mt-1">People registered</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-orange-200/50 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Checked In</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalCheckedIn}</div>
              <p className="text-sm text-gray-600 mt-1">Attendees checked in</p>
            </CardContent>
          </Card>

          <Card className="gradient-card border-orange-200/50 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">Upcoming Events</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{upcomingEvents.length}</div>
              <p className="text-sm text-gray-600 mt-1">Events scheduled ahead</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create Event Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/create-event">
            <Button 
              size="lg" 
              className="btn-primary text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-3 h-6 w-6" />
              Create New Event
            </Button>
          </Link>
        </motion.div>

        {/* Events List */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center">
            <h3 className="text-2xl font-bold text-gray-900">Your Events</h3>
            <div className="ml-4 h-px bg-gradient-to-r from-orange-400 to-green-400 flex-1"></div>
          </div>

          {events.length === 0 ? (
            <Card className="gradient-card border-orange-200/50 text-center">
              <CardContent className="py-16">
                <div className="relative mb-6">
                  <Calendar className="h-16 w-16 text-orange-400 mx-auto" />
                  <div className="absolute inset-0 glow-orange rounded-full opacity-30"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No events yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first event</p>
                <Link href="/create-event">
                  <Button className="btn-primary px-8 py-3 text-lg font-medium rounded-xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden h-full flex flex-col gradient-card border-orange-200/50 card-hover">
                    {event.image && (
                      <div className="aspect-video bg-gradient-to-br from-orange-100/80 to-green-100/80 relative">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">{getStatusBadge(event.status)}</div>
                      </div>
                    )}
                    <CardHeader className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">{event.category}</Badge>
                        <span className="text-sm text-gray-600 font-medium">{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900">{event.name}</CardTitle>
                      <CardDescription className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                        {event.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm mb-6 line-clamp-2">{event.description}</p>

                      {/* RSVP Stats */}
                      <div className="flex items-center justify-between mb-6 text-sm">
                        <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="font-medium">{event.rsvpCount || 0} RSVPs</span>
                        </div>
                        <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="font-medium">{event.checkedInCount || 0} checked in</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex space-x-2">
                          <Link href={`/events/${event._id}`}>
                            <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/edit-event/${event._id}`}>
                            <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {event.status === "upcoming" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openScanner(event._id)}
                              title="Scan QR codes for check-in"
                              className="border-green-200 text-green-600 hover:bg-green-50"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="gradient-card border-orange-200/50">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-gray-900">Delete Event</AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-700">
                                Are you sure you want to delete "{event.name}"? This action cannot be undone and will
                                also delete all RSVPs.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteEvent(event._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* QR Scanner Dialog */}
      <QRScannerDialog
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        eventId={selectedEventId}
        onCheckInSuccess={() => {
          fetchEvents() // Refresh events to update check-in counts
        }}
      />
    </div>
  )
}
