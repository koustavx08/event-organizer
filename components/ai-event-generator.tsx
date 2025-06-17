"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw, Wand2 } from "lucide-react"

interface EventSuggestion {
  name: string
  category: string
  description: string
  tags: string[]
}

interface AIEventGeneratorProps {
  onSelectSuggestion: (suggestion: EventSuggestion) => void
}

export function AIEventGenerator({ onSelectSuggestion }: AIEventGeneratorProps) {
  const [suggestions, setSuggestions] = useState<EventSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  const eventTemplates = [
    {
      name: "Tech Innovation Summit 2024",
      category: "Technology",
      description:
        "Join industry leaders and innovators for a day of cutting-edge technology discussions, networking, and hands-on workshops. Explore the latest trends in AI, blockchain, and sustainable tech solutions.",
      tags: ["Innovation", "Networking", "AI", "Blockchain"],
    },
    {
      name: "Sustainable Living Workshop",
      category: "Education",
      description:
        "Learn practical tips for eco-friendly living in this interactive workshop. Discover sustainable practices for your home, garden, and daily life while connecting with like-minded individuals.",
      tags: ["Sustainability", "Workshop", "Eco-friendly", "Community"],
    },
    {
      name: "Local Artists Showcase",
      category: "Art",
      description:
        "Celebrate local talent in this vibrant showcase featuring paintings, sculptures, photography, and live performances. Support your community's creative spirit and discover new artistic voices.",
      tags: ["Local Artists", "Showcase", "Community", "Creative"],
    },
    {
      name: "Startup Pitch Night",
      category: "Business",
      description:
        "Watch emerging entrepreneurs present their innovative ideas to a panel of investors and industry experts. Network with founders, investors, and business professionals in your area.",
      tags: ["Startups", "Pitching", "Investors", "Entrepreneurship"],
    },
    {
      name: "Wellness & Mindfulness Retreat",
      category: "Health",
      description:
        "Escape the daily hustle and focus on your mental and physical well-being. Enjoy guided meditation, yoga sessions, healthy cooking demos, and stress management workshops.",
      tags: ["Wellness", "Meditation", "Yoga", "Self-care"],
    },
    {
      name: "Food Truck Festival",
      category: "Food",
      description:
        "Taste diverse cuisines from local food trucks in this family-friendly festival. Enjoy live music, games for kids, and discover new flavors from around the world.",
      tags: ["Food Trucks", "Festival", "Family-friendly", "Local Cuisine"],
    },
    {
      name: "Photography Walk & Workshop",
      category: "Art",
      description:
        "Improve your photography skills while exploring scenic locations. Learn composition techniques, lighting tips, and post-processing basics from professional photographers.",
      tags: ["Photography", "Workshop", "Outdoor", "Learning"],
    },
    {
      name: "Community Garden Planting Day",
      category: "Other",
      description:
        "Help build a stronger community by participating in our garden planting initiative. Learn about sustainable gardening, meet your neighbors, and contribute to local food security.",
      tags: ["Community", "Gardening", "Volunteering", "Sustainability"],
    },
    {
      name: "Jazz & Blues Evening",
      category: "Music",
      description:
        "Enjoy an intimate evening of soulful jazz and blues performances by talented local musicians. Perfect for music lovers looking for a sophisticated night out.",
      tags: ["Jazz", "Blues", "Live Music", "Evening"],
    },
    {
      name: "Digital Marketing Masterclass",
      category: "Business",
      description:
        "Master the art of digital marketing with hands-on training in social media strategy, content creation, SEO, and analytics. Perfect for entrepreneurs and marketing professionals.",
      tags: ["Digital Marketing", "Masterclass", "SEO", "Social Media"],
    },
    {
      name: "Family Fun Run & Picnic",
      category: "Sports",
      description:
        "Bring the whole family for a fun run followed by a community picnic. Activities include face painting, games, healthy snacks, and prizes for all participants.",
      tags: ["Family", "Fun Run", "Picnic", "Community"],
    },
    {
      name: "Book Club Literary Discussion",
      category: "Education",
      description:
        "Join fellow book lovers for an engaging discussion about this month's featured novel. Share insights, explore themes, and discover new perspectives in a welcoming environment.",
      tags: ["Book Club", "Literature", "Discussion", "Reading"],
    },
  ]

  const generateSuggestions = () => {
    setLoading(true)

    // Simulate AI generation with random selection
    setTimeout(() => {
      const shuffled = [...eventTemplates].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 3)
      setSuggestions(selected)
      setLoading(false)
    }, 1500)
  }

  const generateMoreSuggestions = () => {
    setLoading(true)

    setTimeout(() => {
      const shuffled = [...eventTemplates].sort(() => 0.5 - Math.random())
      const selected = shuffled.slice(0, 3)
      setSuggestions(selected)
      setLoading(false)
    }, 1000)
  }

  return (
    <Card className="mb-6 border-2 border-dashed border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-indigo-700">
          <Sparkles className="h-5 w-5 mr-2" />
          Create with AI
        </CardTitle>
        <CardDescription>
          Let AI help you create amazing events! Get instant suggestions for event names, categories, and descriptions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center">
            <Button onClick={generateSuggestions} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Event Ideas
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">AI-Generated Event Ideas</h4>
              <Button variant="outline" size="sm" onClick={generateMoreSuggestions} disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>

            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-indigo-100 hover:border-indigo-300">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-gray-900 flex-1">{suggestion.name}</h5>
                        <Badge variant="secondary" className="ml-2">
                          {suggestion.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {suggestion.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onSelectSuggestion(suggestion)}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          Use This Idea
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
