import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch all events in Kolkata with enhanced filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const area = searchParams.get("area")
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    const { db } = await connectToDatabase()

    // Build aggregation pipeline for Kolkata events
    const pipeline: any[] = [
      {
        $match: {
          // Ensure all events are in Kolkata
          $or: [
            { location: { $regex: "Kolkata", $options: "i" } },
            { location: { $regex: "West Bengal", $options: "i" } },
            { area: { $exists: true } },
          ],
        },
      },
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
    ]

    // Add area filter if specified
    if (area && area !== "all") {
      pipeline.unshift({
        $match: { area: area },
      })
    }

    // Add category filter if specified
    if (category && category !== "all") {
      pipeline.unshift({
        $match: { category: category },
      })
    }

    // Add featured filter if specified
    if (featured === "true") {
      pipeline.unshift({
        $match: { featured: true },
      })
    }

    // Add final projection and sorting
    pipeline.push(
      {
        $project: {
          organizerInfo: 0,
          rsvps: 0,
        },
      },
      {
        $sort: {
          featured: -1, // Featured events first
          status: 1, // Upcoming events before completed
          date: 1, // Then by date
        },
      },
    )

    const events = await db.collection("events").aggregate(pipeline).toArray()

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Error fetching Kolkata events:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new event in Kolkata (authenticated)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const { name, date, time, location, area, description, category, image, featured, tags } = await request.json()

    // Validation
    if (!name || !date || !time || !location || !area || !description || !category) {
      return NextResponse.json({ message: "All required fields must be provided" }, { status: 400 })
    }

    // Combine date and time
    const eventDateTime = new Date(`${date}T${time}`)
    const now = new Date()

    if (eventDateTime <= now) {
      return NextResponse.json({ message: "Event date and time must be in the future" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get user info to check role
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) })

    const eventData = {
      name,
      date: eventDateTime,
      location,
      area, // Kolkata-specific area
      description,
      category,
      image: image || null,
      organizer: new ObjectId(decoded.userId),
      status: "upcoming",
      featured: user?.role === "admin" ? featured : false, // Only admins can directly set featured
      tags: tags || [],
      rsvpCount: 0,
      checkedInCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("events").insertOne(eventData)

    return NextResponse.json({
      message: "Event created successfully in Kolkata Events",
      eventId: result.insertedId,
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error creating Kolkata event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
