"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw, Calendar, MapPin, Tag } from "lucide-react"

interface KolkataEventSuggestion {
  name: string
  category: string
  description: string
  area: string
  tags: string
}

interface KolkataAIEventGeneratorProps {
  onSelectSuggestion: (suggestion: KolkataEventSuggestion) => void
}

export function KolkataAIEventGenerator({ onSelectSuggestion }: KolkataAIEventGeneratorProps) {
  const [suggestions, setSuggestions] = useState<KolkataEventSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const kolkataEventTemplates = [
    {
      name: "Durga Puja Pandal Hopping Tour",
      category: "Cultural",
      description:
        "Join us for a guided tour of the most beautiful Durga Puja pandals across Kolkata. Experience the artistry, devotion, and cultural richness of Bengal's biggest festival. Includes traditional Bengali snacks and cultural insights.",
      area: "Park Street",
      tags: "cultural, festival, guided tour, traditional, bengali culture",
    },
    {
      name: "Kolkata Street Food Festival",
      category: "Food & Dining",
      description:
        "Celebrate the incredible street food culture of Kolkata! From phuchka to kathi rolls, jhal muri to mishti doi - taste the authentic flavors that make our city's food scene legendary. Live cooking demonstrations included.",
      area: "Gariahat",
      tags: "street food, bengali cuisine, food festival, authentic, local flavors",
    },
    {
      name: "Rabindra Sangeet Evening at Rabindra Sadan",
      category: "Music",
      description:
        "An enchanting evening dedicated to the timeless melodies of Rabindranath Tagore. Experience the soul-stirring Rabindra Sangeet performed by renowned artists in the iconic Rabindra Sadan. A perfect blend of poetry, music, and Bengali heritage.",
      area: "Esplanade",
      tags: "rabindra sangeet, classical music, tagore, bengali culture, heritage",
    },
    {
      name: "Tech Startup Networking Meetup",
      category: "Technology",
      description:
        "Connect with Kolkata's thriving startup ecosystem! Network with entrepreneurs, developers, and investors. Featuring pitch sessions, tech talks, and collaborative discussions about the future of technology in Eastern India.",
      area: "Salt Lake (Bidhannagar)",
      tags: "startup, networking, technology, entrepreneurship, innovation",
    },
    {
      name: "Kolkata Book Fair Literary Discussion",
      category: "Art & Literature",
      description:
        "Join acclaimed authors and literary enthusiasts for an engaging discussion on contemporary Bengali and Indian literature. Explore the rich literary heritage of Bengal and discover new voices in modern writing.",
      area: "College Street",
      tags: "literature, books, bengali authors, literary discussion, book fair",
    },
    {
      name: "Heritage Walk: Colonial Kolkata",
      category: "Cultural",
      description:
        "Discover the architectural marvels and historical significance of colonial Kolkata. Walk through the streets that witnessed the British Raj, visit iconic buildings, and learn fascinating stories of the city's past.",
      area: "Esplanade",
      tags: "heritage walk, colonial history, architecture, guided tour, historical",
    },
    {
      name: "Yoga and Wellness Workshop",
      category: "Health & Wellness",
      description:
        "Start your wellness journey with traditional yoga practices and meditation techniques. Learn from experienced instructors in a peaceful environment. Includes healthy refreshments and wellness tips for daily life.",
      area: "Lake Gardens",
      tags: "yoga, wellness, meditation, health, mindfulness",
    },
    {
      name: "Bengali Film Screening and Discussion",
      category: "Art & Literature",
      description:
        "Experience the golden era of Bengali cinema with classic film screenings followed by interactive discussions. Celebrate the works of Satyajit Ray, Ritwik Ghatak, and contemporary filmmakers.",
      area: "Tollygunge",
      tags: "bengali cinema, film screening, satyajit ray, tollywood, cultural",
    },
    {
      name: "Handloom and Handicraft Exhibition",
      category: "Cultural",
      description:
        "Showcase of exquisite Bengali handloom textiles and traditional handicrafts. Meet local artisans, learn about traditional techniques, and shop for authentic Bengali crafts including tant sarees and dokra art.",
      area: "Ballygunge",
      tags: "handloom, handicrafts, bengali textiles, artisans, traditional crafts",
    },
    {
      name: "Kolkata Photography Walk",
      category: "Art & Literature",
      description:
        "Capture the essence of Kolkata through your lens! Join fellow photography enthusiasts for a guided walk through the city's most photogenic spots. Tips and techniques from professional photographers included.",
      area: "Howrah",
      tags: "photography, street photography, kolkata streets, visual arts, creative",
    },
  ]

  const generateSuggestions = () => {
    setLoading(true)

    // Simulate AI generation with randomized selection
    setTimeout(() => {
      const shuffled = [...kolkataEventTemplates].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 3)
      setSuggestions(selected)
      setLoading(false)
    }, 1500)
  }

  const handleSelectSuggestion = (suggestion: KolkataEventSuggestion) => {
    onSelectSuggestion(suggestion)
    setIsExpanded(false)
  }

  return (
    <Card className="mb-6 border-orange-100 bg-gradient-to-r from-orange-50/50 to-green-50/50">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Sparkles className="h-5 w-5 text-orange-600 mr-2" />
          AI-Powered Event Ideas for Kolkata
        </CardTitle>
        <CardDescription>Get inspired with AI-generated event ideas tailored for the Kolkata community</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 mb-4">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isExpanded ? "Hide AI Suggestions" : "Get AI Suggestions"}
          </Button>
          {isExpanded && (
            <Button
              onClick={generateSuggestions}
              disabled={loading}
              variant="outline"
              className="border-green-200 text-green-600 hover:bg-green-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Generate New Ideas
            </Button>
          )}
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {loading ? (
            <div className="text-center py-8">
              <Sparkles className="h-8 w-8 text-orange-600 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Generating creative event ideas for Kolkata...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="h-full hover:shadow-md transition-shadow cursor-pointer border-orange-100"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          {suggestion.category}
                        </Badge>
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <CardTitle className="text-sm font-semibold line-clamp-2">{suggestion.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600 mb-3 line-clamp-3">{suggestion.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {suggestion.area}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Tag className="h-3 w-3 mr-1" />
                          {suggestion.tags.split(",").slice(0, 2).join(", ")}...
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-3 bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-700 hover:to-green-700"
                      >
                        Use This Idea
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Click "Generate New Ideas" to get AI-powered event suggestions</p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}
