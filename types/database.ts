import type { ObjectId } from "mongodb"

// User Schema Interface
export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: "admin" | "organizer" | "attendee"
  status: "active" | "blocked" | "pending"
  profile?: {
    avatar?: string
    bio?: string
    phone?: string
    location?: string
    interests?: string[]
  }
  preferences?: {
    emailNotifications: boolean
    smsNotifications: boolean
    eventReminders: boolean
    marketingEmails: boolean
  }
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

// Event Schema Interface
export interface Event {
  _id?: ObjectId
  name: string
  description: string
  date: Date
  endDate?: Date
  location: {
    venue: string
    address: string
    area: string
    coordinates?: {
      latitude: number
      longitude: number
    }
    landmarks?: string[]
  }
  category: string
  subcategory?: string
  organizer: ObjectId
  organizerInfo?: {
    name: string
    email: string
    phone?: string
  }
  images: {
    main: string
    gallery?: string[]
  }
  pricing: {
    type: "free" | "paid"
    amount?: number
    currency?: string
    earlyBird?: {
      amount: number
      deadline: Date
    }
  }
  capacity?: {
    total?: number
    available?: number
  }
  tags: string[]
  status: "draft" | "published" | "cancelled" | "completed"
  featured: boolean
  requirements?: {
    ageLimit?: number
    prerequisites?: string[]
    materials?: string[]
  }
  contact: {
    email: string
    phone?: string
    website?: string
  }
  social?: {
    facebook?: string
    twitter?: string
    instagram?: string
  }
  rsvpCount: number
  checkedInCount: number
  viewCount: number
  shareCount: number
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

// RSVP Schema Interface
export interface RSVP {
  _id?: ObjectId
  eventId: ObjectId
  userId: ObjectId
  userName: string
  userEmail: string
  userPhone?: string
  status: "confirmed" | "cancelled" | "waitlisted"
  ticketType?: string
  specialRequests?: string
  dietaryRestrictions?: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  qrCode: string
  checkedIn: boolean
  checkedInAt?: Date
  checkedInBy?: ObjectId
  paymentStatus?: "pending" | "completed" | "failed" | "refunded"
  paymentId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Category Schema Interface
export interface Category {
  _id?: ObjectId
  name: string
  description: string
  icon: string
  color?: string
  active: boolean
  parentCategory?: ObjectId
  subcategories?: ObjectId[]
  eventCount?: number
  createdAt: Date
  updatedAt: Date
}

// Area Schema Interface
export interface Area {
  _id?: ObjectId
  name: string
  description: string
  active: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
  landmarks: string[]
  popularVenues?: string[]
  transportLinks?: string[]
  eventCount?: number
  createdAt: Date
  updatedAt: Date
}

// Notification Schema Interface
export interface Notification {
  _id?: ObjectId
  userId: ObjectId
  type: "event_reminder" | "rsvp_confirmation" | "event_update" | "system" | "marketing"
  title: string
  message: string
  data?: {
    eventId?: ObjectId
    rsvpId?: ObjectId
    actionUrl?: string
  }
  read: boolean
  sent: boolean
  sentAt?: Date
  channels: ("email" | "sms" | "push")[]
  createdAt: Date
}

// Analytics Schema Interface
export interface Analytics {
  _id?: ObjectId
  eventId: ObjectId
  date: Date
  metrics: {
    views: number
    uniqueViews: number
    rsvps: number
    checkIns: number
    shares: number
    clicks: number
  }
  sources: {
    direct: number
    social: number
    search: number
    referral: number
  }
  demographics?: {
    ageGroups: Record<string, number>
    areas: Record<string, number>
    interests: Record<string, number>
  }
  createdAt: Date
}

// Review Schema Interface
export interface Review {
  _id?: ObjectId
  eventId: ObjectId
  userId: ObjectId
  userName: string
  rating: number
  comment?: string
  images?: string[]
  helpful: number
  reported: boolean
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

// Database Collections Type
export interface DatabaseCollections {
  users: User[]
  events: Event[]
  rsvps: RSVP[]
  categories: Category[]
  areas: Area[]
  notifications: Notification[]
  analytics: Analytics[]
  reviews: Review[]
}
