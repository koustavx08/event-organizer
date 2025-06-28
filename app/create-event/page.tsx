"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Calendar, ArrowLeft, Upload, X, MapPin, Sparkles } from "lucide-react"
import { KolkataAIEventGenerator } from "@/components/kolkata-ai-event-generator"

export default function CreateKolkataEventPage() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    area: "", // Kolkata area
    description: "",
    category: "",
    image: "",
    featured: false,
    tags: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

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

  const handleAISuggestion = (suggestion: any) => {
    setFormData({
      ...formData,
      name: suggestion.name,
      category: suggestion.category,
      description: suggestion.description,
      area: suggestion.area || "",
      tags: suggestion.tags || "",
    })
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

      const response = await fetch("/api/events/kolkata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Event created successfully! Your event is now live in Kolkata Events.")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(data.message || "Failed to create event")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
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
                <Sparkles className="h-6 w-6 text-orange-600 mr-2" />
                Create New Event in Kolkata
              </CardTitle>
              <CardDescription>
                Share your amazing event with the Kolkata community. Fill in the details below to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KolkataAIEventGenerator onSelectSuggestion={handleAISuggestion} />

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

                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your event name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date *</Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="border-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Event Time *</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="border-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => handleSelectChange("category", value)} required>
                      <SelectTrigger className="border-orange-200">
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

                  <div className="space-y-2">
                    <Label htmlFor="area">Area in Kolkata *</Label>
                    <Select onValueChange={(value) => handleSelectChange("area", value)} required>
                      <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="Select area in Kolkata" />
                      </SelectTrigger>
                      <SelectContent>
                        {kolkataAreas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Venue/Location Details *</Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="e.g., Science City Auditorium, Rabindra Sadan, etc."
                    value={formData.location}
                    onChange={handleChange}
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    This will be combined with your selected area to show:{" "}
                    {formData.location && formData.area
                      ? `${formData.location}, ${formData.area}, Kolkata`
                      : "Venue, Area, Kolkata"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Event Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your event in detail. What can attendees expect?"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (Optional)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    type="text"
                    placeholder="e.g., networking, family-friendly, outdoor, free entry (comma-separated)"
                    value={formData.tags}
                    onChange={handleChange}
                    className="border-orange-200 focus:border-orange-400"
                  />
                  <p className="text-sm text-gray-500">Add relevant tags to help people discover your event</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Event preview"
                        className="w-full h-48 object-cover rounded-md border border-orange-200"
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
                    <div className="border-2 border-dashed border-orange-300 rounded-md p-6 text-center bg-orange-50/50">
                      <Upload className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload an attractive image for your event</p>
                      <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      <Label htmlFor="image" className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          asChild
                          className="border-orange-200 text-orange-600 hover:bg-orange-50"
                        >
                          <span>Choose Image</span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                    className="border-orange-300 data-[state=checked]:bg-orange-600"
                  />
                  <Label htmlFor="featured" className="text-sm cursor-pointer">
                    Request to feature this event (subject to admin approval)
                  </Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700"
                    disabled={loading}
                  >
                    {loading ? "Creating Event..." : "Create Event"}
                  </Button>
                  <Link href="/dashboard">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
