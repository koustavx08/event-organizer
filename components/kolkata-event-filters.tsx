"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Filter, X, Star } from "lucide-react"
import { motion } from "framer-motion"

export interface KolkataEventFilters {
  search: string
  category: string
  area: string
  dateFrom: string
  dateTo: string
  status: string
  featured: boolean
}

interface KolkataEventFiltersProps {
  onFiltersChange: (filters: KolkataEventFilters) => void
  totalEvents: number
  filteredCount: number
}

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
  "Alipore",
  "Rajarhat",
  "Dum Dum",
  "Barasat",
  "Garia",
]

const eventCategories = [
  "Cultural",
  "Technology",
  "Music",
  "Food & Dining",
  "Sports",
  "Business",
  "Education",
  "Art & Craft",
  "Literature",
  "Health & Wellness",
  "Fashion",
  "Photography",
]

export function KolkataEventFilters({ onFiltersChange, totalEvents, filteredCount }: KolkataEventFiltersProps) {
  const [filters, setFilters] = useState<KolkataEventFilters>({
    search: "",
    category: "all",
    area: "all",
    dateFrom: "",
    dateTo: "",
    status: "all",
    featured: false,
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof KolkataEventFilters, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      area: "all",
      dateFrom: "",
      dateTo: "",
      status: "all",
      featured: false,
    })
  }

  const hasActiveFilters =
    filters.search ||
    filters.category !== "all" ||
    filters.area !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.status !== "all" ||
    filters.featured

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="mb-6 border-orange-100 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center text-gray-900">
              <Filter className="h-5 w-5 mr-2 text-orange-600" />
              Filter Kolkata Events
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="border-orange-200 text-orange-700"
              >
                {filteredCount} of {totalEvents} events
              </Badge>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="text-gray-700">
                Search Events
              </Label>
              <Input
                id="search"
                placeholder="Search by name, description, organizer..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="border-orange-200 focus:border-orange-400 bg-white text-gray-900"
              />
            </div>

            {/* Category */}
            <div>
              <Label className="text-gray-700">Category</Label>
              <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                <SelectTrigger className="border-orange-200 bg-white text-gray-900">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border-orange-200">
                  <SelectItem value="all" className="hover:bg-gray-100">
                    All Categories
                  </SelectItem>
                  {eventCategories.map((category) => (
                    <SelectItem key={category} value={category} className="hover:bg-gray-100">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Area */}
            <div>
              <Label className="text-gray-700 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                Kolkata Area
              </Label>
              <Select value={filters.area} onValueChange={(value) => updateFilter("area", value)}>
                <SelectTrigger className="border-orange-200 bg-white text-gray-900">
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent className="bg-white border-orange-200">
                  <SelectItem value="all" className="hover:bg-gray-100">
                    All Areas
                  </SelectItem>
                  {kolkataAreas.map((area) => (
                    <SelectItem key={area} value={area} className="hover:bg-gray-100">
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label className="text-gray-700">Status</Label>
              <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                <SelectTrigger className="border-orange-200 bg-white text-gray-900">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-orange-200">
                  <SelectItem value="all" className="hover:bg-gray-100">
                    All Status
                  </SelectItem>
                  <SelectItem value="upcoming" className="hover:bg-gray-100">
                    Upcoming
                  </SelectItem>
                  <SelectItem value="completed" className="hover:bg-gray-100">
                    Completed
                  </SelectItem>
                  <SelectItem value="cancelled" className="hover:bg-gray-100">
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-orange-600 hover:bg-orange-50"
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Filters
            </Button>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={filters.featured}
                onChange={(e) => updateFilter("featured", e.target.checked)}
                className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 bg-gray-100"
              />
              <Label
                htmlFor="featured"
                className="text-sm text-gray-700 flex items-center cursor-pointer"
              >
                <Star className="h-4 w-4 mr-1 text-orange-500" />
                Featured Events Only
              </Label>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-orange-100"
            >
              <div>
                <Label htmlFor="dateFrom" className="text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-green-500" />
                  From Date
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                  className="border-orange-200 focus:border-orange-400 bg-white text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-gray-700 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-green-500" />
                  To Date
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                  className="border-orange-200 focus:border-orange-400 bg-white text-gray-900"
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
