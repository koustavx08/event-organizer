import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch all events (public) with RSVP counts
export async function GET() {
  try {
    const { db } = await connectToDatabase()

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
            organizerInfo: 0,
            rsvps: 0,
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .toArray()

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new event (authenticated)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const { name, date, location, description, category, image } = await request.json()

    // Validation
    if (!name || !date || !location || !description || !category) {
      return NextResponse.json({ message: "All required fields must be provided" }, { status: 400 })
    }

    // Check if date is in the future
    const eventDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (eventDate < today) {
      return NextResponse.json({ message: "Event date must be in the future" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const eventData = {
      name,
      date: eventDate,
      location,
      description,
      category,
      image: image || null,
      organizer: new ObjectId(decoded.userId),
      status: "upcoming",
      rsvpCount: 0,
      checkedInCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("events").insertOne(eventData)

    return NextResponse.json({
      message: "Event created successfully",
      eventId: result.insertedId,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error creating event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
