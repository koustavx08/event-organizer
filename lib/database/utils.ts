import { ObjectId, type Db } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import type { User, Event, RSVP, Category, Area } from "@/types/database"

export class DatabaseUtils {
  private static async getDb(): Promise<Db> {
    const { db } = await connectToDatabase()
    return db
  }

  // User utilities
  static async createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
    const db = await this.getDb()
    const now = new Date()

    const user: User = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("users").insertOne(user)
    return result.insertedId
  }

  static async getUserById(userId: string): Promise<User | null> {
    const db = await this.getDb()
    return (await db.collection("users").findOne({ _id: new ObjectId(userId) })) as User | null
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const db = await this.getDb()
    return (await db.collection("users").findOne({ email })) as User | null
  }

  static async updateUser(userId: string, updateData: Partial<User>): Promise<boolean> {
    const db = await this.getDb()
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: { ...updateData, updatedAt: new Date() } })
    return result.modifiedCount > 0
  }

  // Event utilities
  static async createEvent(
    eventData: Omit<
      Event,
      "_id" | "createdAt" | "updatedAt" | "rsvpCount" | "checkedInCount" | "viewCount" | "shareCount"
    >,
  ): Promise<ObjectId> {
    const db = await this.getDb()
    const now = new Date()

    const event: Event = {
      ...eventData,
      rsvpCount: 0,
      checkedInCount: 0,
      viewCount: 0,
      shareCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("events").insertOne(event)
    return result.insertedId
  }

  static async getEventById(eventId: string): Promise<Event | null> {
    const db = await this.getDb()
    return (await db.collection("events").findOne({ _id: new ObjectId(eventId) })) as Event | null
  }

  static async getEventsByArea(area: string, limit = 10): Promise<Event[]> {
    const db = await this.getDb()
    return (await db
      .collection("events")
      .find({
        "location.area": area,
        status: "published",
        date: { $gte: new Date() },
      })
      .sort({ date: 1 })
      .limit(limit)
      .toArray()) as Event[]
  }

  static async getEventsByCategory(category: string, limit = 10): Promise<Event[]> {
    const db = await this.getDb()
    return (await db
      .collection("events")
      .find({
        category,
        status: "published",
        date: { $gte: new Date() },
      })
      .sort({ date: 1 })
      .limit(limit)
      .toArray()) as Event[]
  }

  static async searchEvents(
    query: string,
    filters?: {
      area?: string
      category?: string
      dateFrom?: Date
      dateTo?: Date
    },
  ): Promise<Event[]> {
    const db = await this.getDb()

    const searchQuery: any = {
      $text: { $search: query },
      status: "published",
      date: { $gte: new Date() },
    }

    if (filters?.area) {
      searchQuery["location.area"] = filters.area
    }

    if (filters?.category) {
      searchQuery.category = filters.category
    }

    if (filters?.dateFrom || filters?.dateTo) {
      searchQuery.date = {}
      if (filters.dateFrom) {
        searchQuery.date.$gte = filters.dateFrom
      }
      if (filters.dateTo) {
        searchQuery.date.$lte = filters.dateTo
      }
    }

    return (await db
      .collection("events")
      .find(searchQuery)
      .sort({ score: { $meta: "textScore" }, date: 1 })
      .toArray()) as Event[]
  }

  static async incrementEventView(eventId: string): Promise<void> {
    const db = await this.getDb()
    await db.collection("events").updateOne({ _id: new ObjectId(eventId) }, { $inc: { viewCount: 1 } })
  }

  static async incrementEventShare(eventId: string): Promise<void> {
    const db = await this.getDb()
    await db.collection("events").updateOne({ _id: new ObjectId(eventId) }, { $inc: { shareCount: 1 } })
  }

  // RSVP utilities
  static async createRSVP(rsvpData: Omit<RSVP, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
    const db = await this.getDb()
    const now = new Date()

    const rsvp: RSVP = {
      ...rsvpData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("rsvps").insertOne(rsvp)

    // Update event RSVP count
    await db
      .collection("events")
      .updateOne({ _id: new ObjectId(rsvpData.eventId.toString()) }, { $inc: { rsvpCount: 1 } })

    return result.insertedId
  }

  static async getRSVPByEventAndUser(eventId: string, userId: string): Promise<RSVP | null> {
    const db = await this.getDb()
    return (await db.collection("rsvps").findOne({
      eventId: new ObjectId(eventId),
      userId: new ObjectId(userId),
    })) as RSVP | null
  }

  static async checkInRSVP(qrCode: string, checkedInBy: string): Promise<boolean> {
    const db = await this.getDb()
    const result = await db.collection("rsvps").updateOne(
      { qrCode, checkedIn: false },
      {
        $set: {
          checkedIn: true,
          checkedInAt: new Date(),
          checkedInBy: new ObjectId(checkedInBy),
        },
      },
    )

    if (result.modifiedCount > 0) {
      // Update event checked-in count
      const rsvp = (await db.collection("rsvps").findOne({ qrCode })) as RSVP
      if (rsvp) {
        await db.collection("events").updateOne({ _id: rsvp.eventId }, { $inc: { checkedInCount: 1 } })
      }
      return true
    }
    return false
  }

  // Category utilities
  static async getActiveCategories(): Promise<Category[]> {
    const db = await this.getDb()
    return (await db.collection("categories").find({ active: true }).sort({ name: 1 }).toArray()) as Category[]
  }

  // Area utilities
  static async getActiveAreas(): Promise<Area[]> {
    const db = await this.getDb()
    return (await db.collection("areas").find({ active: true }).sort({ name: 1 }).toArray()) as Area[]
  }

  // Analytics utilities
  static async getEventAnalytics(eventId: string, dateFrom?: Date, dateTo?: Date) {
    const db = await this.getDb()

    const matchQuery: any = { eventId: new ObjectId(eventId) }
    if (dateFrom || dateTo) {
      matchQuery.date = {}
      if (dateFrom) matchQuery.date.$gte = dateFrom
      if (dateTo) matchQuery.date.$lte = dateTo
    }

    return await db
      .collection("analytics")
      .aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$metrics.views" },
            totalUniqueViews: { $sum: "$metrics.uniqueViews" },
            totalRSVPs: { $sum: "$metrics.rsvps" },
            totalCheckIns: { $sum: "$metrics.checkIns" },
            totalShares: { $sum: "$metrics.shares" },
            avgViews: { $avg: "$metrics.views" },
            avgRSVPs: { $avg: "$metrics.rsvps" },
          },
        },
      ])
      .toArray()
  }

  // Admin utilities
  static async getUserStats() {
    const db = await this.getDb()

    return await db
      .collection("users")
      .aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()
  }

  static async getEventStats() {
    const db = await this.getDb()

    return await db
      .collection("events")
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()
  }
}
