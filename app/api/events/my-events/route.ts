import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const { db } = await connectToDatabase()

    const events = await db
      .collection("events")
      .aggregate([
        { $match: { organizer: new ObjectId(decoded.userId) } },
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
          $lookup: {
            from: "rsvps",
            let: { eventId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$eventId", "$$eventId"] },
                      { $eq: ["$status", "confirmed"] },
                      { $eq: ["$checkedIn", true] },
                    ],
                  },
                },
              },
            ],
            as: "checkedInRsvps",
          },
        },
        {
          $addFields: {
            rsvpCount: { $size: "$rsvps" },
            checkedInCount: { $size: "$checkedInRsvps" },
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
            rsvps: 0,
            checkedInRsvps: 0,
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray()

    return NextResponse.json({ events })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error fetching user events:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
