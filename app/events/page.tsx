"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, Users, CheckCircle, Clock, XCircle, Star } from "lucide-react"
import { KolkataEventFilters, type KolkataEventFilters as EventFiltersType } from "@/components/kolkata-event-filters"

interface Event {
  _id: string
  name: string
  date: string
  location: string
  area: string // Specific area in Kolkata
  description: string
  category: string
  image?: string
  organizer: string
  organizerName?: string
  status: "upcoming" | "completed" | "cancelled"
  rsvpCount?: number
  featured?: boolean
  tags?: string[]
}

export default function KolkataEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKolkataEvents()
  }, [])

  const fetchKolkataEvents = async () => {
    try {
      const response = await fetch("/api/events/kolkata")
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
        setFilteredEvents(data.events)
      }
    } catch (error) {
      console.error("Error fetching Kolkata events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = useCallback(
    (filters: EventFiltersType) => {
      let filtered = [...events]

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filtered = filtered.filter(
          (event) =>
            event.name.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.location.toLowerCase().includes(searchTerm) ||
            event.area.toLowerCase().includes(searchTerm) ||
            (event.organizerName && event.organizerName.toLowerCase().includes(searchTerm)) ||
            (event.tags && event.tags.some((tag) => tag.toLowerCase().includes(searchTerm))),
        )
      }

      // Category filter
      if (filters.category && filters.category !== "all") {
        filtered = filtered.filter((event) => event.category === filters.category)
      }

      // Area filter (Kolkata specific)
      if (filters.area && filters.area !== "all") {
        filtered = filtered.filter((event) => event.area === filters.area)
      }

      // Date range filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        filtered = filtered.filter((event) => new Date(event.date) >= fromDate)
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999)
        filtered = filtered.filter((event) => new Date(event.date) <= toDate)
      }

      // Status filter
      if (filters.status && filters.status !== "all") {
        filtered = filtered.filter((event) => event.status === filters.status)
      }

      // Featured filter
      if (filters.featured) {
        filtered = filtered.filter((event) => event.featured)
      }

      // Sort by date and featured status
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        if (a.status === "upcoming" && b.status !== "upcoming") return -1
        if (a.status !== "upcoming" && b.status === "upcoming") return 1
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })

      setFilteredEvents(filtered)
    },
    [events],
  )

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
          <p className="text-gray-600 dark:text-gray-300">Discovering amazing events in Kolkata...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600 mr-2" />
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 dark:from-orange-400 dark:to-green-400 bg-clip-text text-transparent">
                  Kolkata Events
                </h1>
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950"
                >
                  Login
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Events in Kolkata</h2>
          <p className="text-gray-600 dark:text-gray-300">Discover amazing events happening across the City of Joy</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <KolkataEventFilters
            onFiltersChange={handleFiltersChange}
            totalEvents={events.length}
            filteredCount={filteredEvents.length}
          />
        </motion.div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-orange-100">
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Try adjusting your search criteria or check back later for new events in Kolkata
                </p>
                <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 h-full flex flex-col border-orange-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  {event.image && (
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-green-100 relative overflow-hidden">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {event.featured && (
                          <Badge className="bg-gradient-to-r from-orange-600 to-green-600 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {getStatusBadge(event.status)}
                      </div>
                    </div>
                  )}
                  <CardHeader className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {event.category}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{event.name}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0 text-orange-500" />
                        <span className="truncate">{event.area}, Kolkata</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4 mr-1 flex-shrink-0 text-green-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4 mr-1" />
                        <span className="truncate">{event.organizerName || event.organizer}</span>
                      </div>
                      {event.rsvpCount !== undefined && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{event.rsvpCount}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Link href={`/events/${event._id}`}>
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
