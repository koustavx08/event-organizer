import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch admin dashboard stats
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const { db } = await connectToDatabase()

    // Check if user is admin
    const user = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
      role: "admin",
    })

    if (!user) {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 })
    }

    // Get current date info for filtering
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get total users count
    const totalUsers = await db.collection("users").countDocuments()

    // Get new users this month
    const newUsersThisMonth = await db.collection("users").countDocuments({
      createdAt: { $gte: firstDayOfMonth },
    })

    // Get total events count
    const totalEvents = await db.collection("events").countDocuments()

    // Get new events this month
    const newEventsThisMonth = await db.collection("events").countDocuments({
      createdAt: { $gte: firstDayOfMonth },
    })

    // Get upcoming and completed events
    const upcomingEvents = await db.collection("events").countDocuments({
      date: { $gte: now },
    })

    const completedEvents = await db.collection("events").countDocuments({
      date: { $lt: now },
    })

    // Get total RSVPs and check-ins
    const rsvpStats = await db
      .collection("rsvps")
      .aggregate([
        {
          $group: {
            _id: null,
            totalRsvps: { $sum: 1 },
            totalCheckins: {
              $sum: { $cond: [{ $eq: ["$checkedIn", true] }, 1, 0] },
            },
          },
        },
      ])
      .toArray()

    const totalRsvps = rsvpStats.length > 0 ? rsvpStats[0].totalRsvps : 0
    const totalCheckins = rsvpStats.length > 0 ? rsvpStats[0].totalCheckins : 0

    // Get category breakdown
    const categoryBreakdown = await db
      .collection("events")
      .aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: 1,
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
      ])
      .toArray()

    // Get monthly events for the past 6 months
    const monthlyEvents = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)

      const count = await db.collection("events").countDocuments({
        date: { $gte: month, $lt: nextMonth },
      })

      monthlyEvents.push({
        month: month.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        count,
      })
    }

    return NextResponse.json({
      totalUsers,
      totalEvents,
      totalRsvps,
      totalCheckins,
      newUsersThisMonth,
      newEventsThisMonth,
      upcomingEvents,
      completedEvents,
      categoryBreakdown,
      monthlyEvents,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
