"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Search, Trash2, Eye, Calendar, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

interface EventData {
  _id: string
  name: string
  date: string
  location: string
  category: string
  organizer: string
  organizerName: string
  status: "upcoming" | "completed" | "cancelled"
  rsvpCount: number
  createdAt: string
}

export function AdminEvents() {
  const [events, setEvents] = useState<EventData[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, categoryFilter, statusFilter])

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/admin/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      } else {
        console.error("Failed to fetch events")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(term) ||
          event.location.toLowerCase().includes(term) ||
          event.organizerName.toLowerCase().includes(term),
      )
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((event) => event.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter)
    }

    setFilteredEvents(filtered)
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Remove from local state
        setEvents(events.filter((event) => event._id !== eventId))
      }
    } catch (error) {
      console.error("Error deleting event:", error)
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

  const categories = [
    "Technology",
    "Business",
    "Music",
    "Sports",
    "Food",
    "Art",
    "Education",
    "Health",
    "Travel",
    "Other",
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Calendar className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>Event Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events by name, location, or organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>RSVPs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No events found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event._id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{event.category}</Badge>
                      </TableCell>
                      <TableCell>{event.organizerName}</TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell>{event.rsvpCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/events/${event._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Event</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{event.name}"? This action cannot be undone and will
                                  remove all RSVPs for this event.
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
