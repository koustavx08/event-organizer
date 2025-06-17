import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch all events (admin only)
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

    // Fetch all events with organizer info and RSVP counts
    const events = await db
      .collection("events")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "organizer",
            foreignField: "_id",
            as: "organizerInfo",
          },
        },
        {
          $lookup: {
            from: "rsvps",
            let: { eventId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$eventId", "$$eventId"] }, { $eq: ["$status", "confirmed"] }],
                  },
                },
              },
            ],
            as: "rsvps",
          },
        },
        {
          $addFields: {
            organizerName: { $arrayElemAt: ["$organizerInfo.name", 0] },
            rsvpCount: { $size: "$rsvps" },
            // Determine event status based on date
            status: {
              $cond: {
                if: { $gte: ["$date", new Date()] },
                then: "upcoming",
                else: "completed",
              },
            },
          },
        },
        {
          $project: {
            name: 1,
            date: 1,
            location: 1,
            category: 1,
            organizer: 1,
            organizerName: 1,
            status: 1,
            rsvpCount: 1,
            createdAt: 1,
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .toArray()

    return NextResponse.json({ events })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error fetching events:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
