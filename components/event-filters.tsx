"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X, Calendar, MapPin, Tag } from "lucide-react"

interface EventFiltersProps {
  onFiltersChange: (filters: EventFilters) => void
  totalEvents: number
  filteredCount: number
}

export interface EventFilters {
  search: string
  category: string
  location: string
  dateFrom: string
  dateTo: string
  status: string
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

export function EventFilters({ onFiltersChange, totalEvents, filteredCount }: EventFiltersProps) {
  const [filters, setFilters] = useState<EventFilters>({
    search: "",
    category: "",
    location: "",
    dateFrom: "",
    dateTo: "",
    status: "",
  })

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof EventFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      location: "",
      dateFrom: "",
      dateTo: "",
      status: "",
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== "")

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Search Bar - Always Visible */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events by name, description, or location..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)} className="sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            {isExpanded ? "Hide Filters" : "More Filters"}
            {hasActiveFilters && !isExpanded && (
              <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                {Object.values(filters).filter((v) => v !== "").length}
              </span>
            )}
          </Button>
        </div>

        {/* Advanced Filters - Collapsible */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium">
                <Tag className="h-4 w-4 mr-1" />
                Category
              </Label>
              <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
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
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium">
                <MapPin className="h-4 w-4 mr-1" />
                Location
              </Label>
              <Input
                placeholder="City or venue"
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
              />
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium">
                <Calendar className="h-4 w-4 mr-1" />
                From Date
              </Label>
              <Input type="date" value={filters.dateFrom} onChange={(e) => updateFilter("dateFrom", e.target.value)} />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label className="flex items-center text-sm font-medium">
                <Calendar className="h-4 w-4 mr-1" />
                To Date
              </Label>
              <Input type="date" value={filters.dateTo} onChange={(e) => updateFilter("dateTo", e.target.value)} />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} disabled={!hasActiveFilters} className="w-full">
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
          <span>
            Showing {filteredCount} of {totalEvents} events
          </span>
          {hasActiveFilters && (
            <span className="text-indigo-600">
              {Object.values(filters).filter((v) => v !== "").length} filter(s) applied
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
