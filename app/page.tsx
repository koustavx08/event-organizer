"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Plus, Search } from "lucide-react"

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 ml-3">
                Kolkata Events
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/events"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Events
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover Events in{" "}
            <span className="text-blue-600">Kolkata</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Find amazing events happening in the City of Joy. From cultural festivals to tech conferences, 
            connect with your community and create memorable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                <Search className="mr-2 h-5 w-5" />
                Browse Events
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Events</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what's happening in Kolkata this month
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {event.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg text-gray-900 line-clamp-2 mb-2">{event.name}</CardTitle>
                  <div className="space-y-1">
                    <CardDescription className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </CardDescription>
                    <CardDescription className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDateString(event.date)}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">by {event.organizer}</p>
                    <Link href={`/events/${event.id}`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/events">
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Kolkata Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Explore by Area</h3>
            <p className="text-lg text-gray-600">
              Find events in your neighborhood
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {kolkataAreas.map((area) => (
              <Link key={area} href={`/events?location=${encodeURIComponent(area)}`}>
                <Card className="text-center hover:shadow-md transition-shadow duration-200 cursor-pointer border-gray-200 bg-white">
                  <CardContent className="p-4">
                    <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900 text-sm">{area}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Kolkata Events?</h3>
            <p className="text-lg text-gray-600">
              The best platform for discovering events in the City of Joy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Local Focus</h4>
              <p className="text-gray-600">
                Exclusively featuring events in Kolkata with detailed location information
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h4>
              <p className="text-gray-600">
                Connect with fellow Kolkatans and discover events that match your interests
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mx-auto mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Easy Management</h4>
              <p className="text-gray-600">
                Simple tools for organizers to create and manage their events
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-6 w-6 text-blue-400 mr-2" />
              <h3 className="text-xl font-semibold">Kolkata Events</h3>
            </div>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Discover and organize amazing events in the City of Joy
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Platform</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
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
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Support</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
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
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 text-white uppercase tracking-wider">Made for Kolkata</h4>
                <p className="text-sm text-gray-400">
                  &copy; 2024 Kolkata Events. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
