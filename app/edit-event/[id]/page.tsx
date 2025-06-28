"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, ArrowLeft, Upload, X, MapPin, Edit } from "lucide-react"

interface Event {
  _id: string
  name: string
  date: string
  time: string
  location: string
  area: string
  description: string
  category: string
  image?: string
  featured: boolean
  tags: string[]
  organizer: string
}

export default function EditEventPage() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    area: "",
    description: "",
    category: "",
    image: "",
    featured: false,
    tags: "",
  })
  const [originalEvent, setOriginalEvent] = useState<Event | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState("")
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    if (eventId) {
      fetchEvent()
    }
  }, [router, eventId])

  const fetchEvent = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const event = data.event

        // Extract location parts
        const locationParts = event.location.split(", ")
        const venue = locationParts[0] || ""
        const area = locationParts[1] || ""

        // Extract date and time
        const eventDate = new Date(event.date)
        const dateStr = eventDate.toISOString().split("T")[0]
        const timeStr = eventDate.toTimeString().split(" ")[0].substring(0, 5)

        setOriginalEvent(event)
        setFormData({
          name: event.name,
          date: dateStr,
          time: timeStr,
          location: venue,
          area: area,
          description: event.description,
          category: event.category,
          image: event.image || "",
          featured: event.featured || false,
          tags: event.tags ? event.tags.join(", ") : "",
        })

        if (event.image) {
          setImagePreview(event.image)
        }
      } else if (response.status === 404) {
        setError("Event not found")
      } else if (response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      } else {
        setError("Failed to load event")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setFetchLoading(false)
    }
  }

  const categories = [
    "Cultural",
    "Technology",
    "Music",
    "Business",
    "Sports",
    "Food & Dining",
    "Art & Literature",
    "Education",
    "Health & Wellness",
    "Festival",
    "Workshop",
    "Conference",
    "Other",
  ]

  const kolkataAreas = [
    "Park Street",
    "Salt Lake (Bidhannagar)",
    "New Town (Rajarhat)",
    "Ballygunge",
    "Gariahat",
    "Esplanade",
    "Howrah",
    "Jadavpur",
    "Tollygunge",
    "Behala",
    "Dum Dum",
    "Barasat",
    "Garia",
    "Kasba",
    "Lake Gardens",
    "Alipore",
    "Bhowanipore",
    "Shyambazar",
    "Burrabazar",
    "College Street",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({
          ...formData,
          image: base64String,
        })
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData({
      ...formData,
      image: "",
    })
    setImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validation
    if (
      !formData.name ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.area ||
      !formData.description ||
      !formData.category
    ) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Check if date is in the future
    const eventDateTime = new Date(`${formData.date}T${formData.time}`)
    const now = new Date()

    if (eventDateTime <= now) {
      setError("Event date and time must be in the future")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const eventData = {
        ...formData,
        location: `${formData.location}, ${formData.area}, Kolkata, West Bengal`,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Event updated successfully!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(data.message || "Failed to update event")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
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

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Kolkata Events
              </h1>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-orange-100">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Edit className="h-6 w-6 text-orange-600 mr-2" />
                Edit Event
              </CardTitle>
              <CardDescription>
                Update your event details below. All changes will be reflected immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {/* Event Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                {/* Location and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Venue/Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Science City Auditorium"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Kolkata Area *</Label>
                    <Select value={formData.area} onValueChange={(value) => handleSelectChange("area", value)}>
                      <SelectTrigger className="border-orange-200 focus:border-orange-400">
                        <SelectValue placeholder="Select area in Kolkata" />
                      </SelectTrigger>
                      <SelectContent>
                        {kolkataAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            <MapPin className="h-4 w-4 mr-2 inline" />
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
                      <SelectValue placeholder="Select event category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your event in detail..."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (optional)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="Enter tags separated by commas (e.g., networking, startup, tech)"
                    value={formData.tags}
                    onChange={handleChange}
                    className="border-orange-200 focus:border-orange-400"
                  />
                  <p className="text-sm text-gray-500">Separate multiple tags with commas</p>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Event Image (optional)</Label>
                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full max-w-sm h-48 object-cover rounded-lg border border-orange-200"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                      <Upload className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-orange-600 hover:text-orange-700 font-medium">
                          Click to upload an image
                        </span>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </Label>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>

                {/* Featured Event */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked as boolean })
                    }
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Mark as featured event
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600"
                  disabled={loading}
                >
                  {loading ? "Updating Event..." : "Update Event"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
