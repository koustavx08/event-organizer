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
      image: "https://images.unsplash.com/photo-1602136433307-f8a71bd20449?w=500&h=300&fit=crop&crop=center",
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
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop&crop=center",
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
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop&crop=center",
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
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative p-2 bg-gradient-to-br from-orange-100 to-green-100 rounded-xl">
                <Calendar className="h-8 w-8 text-orange-600 mr-2" />
                <Sparkles className="h-4 w-4 text-green-600 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent ml-3">
                Kolkata Events
              </h1>
            </motion.div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/events"
                className="text-gray-700 hover:text-orange-600 transition-all duration-300 font-medium px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                Discover Events
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 font-medium shadow-sm"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="btn-primary text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                  Join Now
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Introduction Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 via-white/20 to-green-100/40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight">
              Discover Amazing Events in{" "}
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-green-600 bg-clip-text text-transparent relative">
                Kolkata
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-green-400 rounded-full opacity-30"></div>
              </span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed">
              From cultural festivals to tech conferences, explore the vibrant event scene in the City of Joy. Connect
              with your community and create unforgettable memories.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/events">
                <Button
                  size="lg"
                  className="btn-primary text-white px-10 py-4 text-lg font-semibold rounded-xl"
                >
                  <Calendar className="mr-3 h-6 w-6" />
                  Explore Events
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:border-orange-400 hover:shadow-lg"
                >
                  <Plus className="mr-3 h-6 w-6" />
                  Create Event
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/90 via-yellow-300/80 to-green-500/90"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-200 to-orange-100 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-green-200 to-green-100 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight text-shadow-white">
              Ready to Explore Kolkata's Event Scene?
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/90 leading-relaxed text-shadow-white">
              Join thousands of Kolkatans discovering amazing events every day
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/events">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-10 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
                >
                  Browse Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-4xl font-extrabold text-gray-900 mb-6">Featured Events in Kolkata</h3>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Don't miss these exciting upcoming events in the City of Joy
            </p>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-orange-400 to-green-400 rounded-full mx-auto"></div>
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
                <Card className="overflow-hidden card-hover h-full flex flex-col gradient-card border-orange-200/50 shadow-lg">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-orange-100/80 to-green-100/80">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-orange-600 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center shadow-lg">
                        <Star className="h-4 w-4 mr-2" />
                        Featured
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/95 backdrop-blur-sm text-orange-700 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
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

      {/* Footer-style CTA Section */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-8 w-8 text-orange-400 mr-3" />
              <h3 className="text-2xl font-bold">Kolkata Events</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Your premier destination for discovering and organizing events in Kolkata, West Bengal. Connecting the City of Joy through amazing experiences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Platform</h4>
                <ul className="space-y-2 text-gray-300">
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
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Support</h4>
                <ul className="space-y-2 text-gray-300">
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
              <div>
                <h4 className="text-lg font-semibold mb-4 text-orange-400">Made with ❤️ for Kolkata</h4>
                <p className="text-sm text-gray-400 mb-4">
                  &copy; 2024 Kolkata Events. All rights reserved. Proudly serving the City of Joy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
