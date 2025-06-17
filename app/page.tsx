"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Plus, Star, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

// Helper function for deterministic date formatting
function formatDateString(dateString: string): string {
  const date = new Date(dateString);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekday = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

export default function HomePage() {
  // Mock data for Kolkata events
  const featuredEvents = [
    {
      id: 1,
      name: "Durga Puja Cultural Festival",
      date: "2024-10-15",
      location: "Park Street, Kolkata",
      description:
        "Experience the grandeur of Kolkata's most celebrated festival with cultural performances and traditional food",
      category: "Cultural",
      image: "/placeholder.svg?height=200&width=300",
      organizer: "Kolkata Cultural Society",
      featured: true,
    },
    {
      id: 2,
      name: "Tech Summit Kolkata 2024",
      date: "2024-11-20",
      location: "Science City, Kolkata",
      description: "Leading technology conference featuring AI, blockchain, and startup innovations in Eastern India",
      category: "Technology",
      image: "/placeholder.svg?height=200&width=300",
      organizer: "Bengal Tech Hub",
      featured: true,
    },
    {
      id: 3,
      name: "Rabindra Sangeet Evening",
      date: "2024-12-05",
      location: "Rabindra Sadan, Kolkata",
      description: "An enchanting evening of Tagore's timeless melodies performed by renowned artists",
      category: "Music",
      image: "/placeholder.svg?height=200&width=300",
      organizer: "Rabindra Bharati University",
      featured: true,
    },
  ]

  const kolkataAreas = [
    "Park Street",
    "Salt Lake",
    "New Town",
    "Ballygunge",
    "Gariahat",
    "Esplanade",
    "Howrah",
    "Jadavpur",
    "Tollygunge",
    "Behala",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <Calendar className="h-8 w-8 text-orange-600 mr-2" />
                <Sparkles className="h-4 w-4 text-green-600 absolute -top-1 -right-1" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Kolkata Events
              </h1>
            </motion.div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/events"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Discover Events
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700">
                  Join Now
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-green-100/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Discover Amazing Events in{" "}
              <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                Kolkata
              </span>
            </h2>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              From cultural festivals to tech conferences, explore the vibrant event scene in the City of Joy. Connect
              with your community and create unforgettable memories.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-green-600 text-white px-8"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Explore Events
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-orange-200 px-8"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Event
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Featured Events in Kolkata</h3>
            <p className="text-lg text-gray-600">
              Don't miss these exciting upcoming events in the City of Joy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-orange-100 bg-white">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-orange-100 to-green-100">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-orange-600 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl text-gray-900 line-clamp-2">{event.name}</CardTitle>
                    <CardDescription className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                      {event.location}
                    </CardDescription>
                    <CardDescription className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1 text-green-500" />
                      {formatDateString(event.date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">by {event.organizer}</p>
                      <Link href={`/events/${event.id}`}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-600 to-green-600"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="border-orange-200"
              >
                View All Events in Kolkata
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Kolkata Areas */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Explore Events by Area</h3>
            <p className="text-lg text-gray-600">
              Find events happening in your favorite parts of Kolkata
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {kolkataAreas.map((area, index) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={`/events?location=${encodeURIComponent(area)}`}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer border-orange-100 hover:border-orange-200 bg-white">
                    <CardContent className="p-4">
                      <MapPin className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">{area}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Why Choose Kolkata Events?</h3>
            <p className="text-lg text-gray-600">
              Everything you need to discover and organize events in Kolkata
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-orange-100 to-green-100 text-orange-600 mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Local Focus</h4>
              <p className="text-gray-600">
                Exclusively featuring events in Kolkata, West Bengal, with detailed location information
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-orange-100 to-green-100 text-green-600 mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h4>
              <p className="text-gray-600">
                Connect with fellow Kolkatans and discover events that match your interests
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-orange-100 to-green-100 text-orange-600 mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Easy Management</h4>
              <p className="text-gray-600">
                Simple tools for organizers to create, manage, and promote their events
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h3 className="text-3xl font-extrabold text-white mb-4">Ready to Explore Kolkata's Event Scene?</h3>
            <p className="text-xl text-orange-100 mb-8">
              Join thousands of Kolkatans discovering amazing events every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-orange-50 px-8"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8"
                >
                  Browse Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-orange-400 mr-2" />
                <h3 className="text-xl font-bold">Kolkata Events</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Your premier destination for discovering and organizing events in Kolkata, West Bengal. Connecting the
                City of Joy through amazing experiences.
              </p>
              <p className="text-sm text-gray-500">Made with ❤️ for Kolkata</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/events" className="hover:text-white transition-colors">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/create-event" className="hover:text-white transition-colors">
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kolkata Events. All rights reserved. Proudly serving the City of Joy.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
