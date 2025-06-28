import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch single event (public)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 })
    }

    const event = await db
      .collection("events")
      .aggregate([
        { $match: { _id: new ObjectId(params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "organizer",
            foreignField: "_id",
            as: "organizerInfo",
          },
        },
        {
          $addFields: {
            organizerName: { $arrayElemAt: ["$organizerInfo.name", 0] },
          },
        },
        {
          $project: {
            organizerInfo: 0,
          },
        },
      ])
      .toArray()

    if (event.length === 0) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ event: event[0] })
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update event (authenticated, owner only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if event exists and user is the organizer
    const existingEvent = await db.collection("events").findOne({
      _id: new ObjectId(params.id),
      organizer: new ObjectId(decoded.userId),
    })

    if (!existingEvent) {
      return NextResponse.json({ message: "Event not found or you don't have permission to edit it" }, { status: 404 })
    }

    const { name, date, time, location, description, category, image, featured, tags, area } = await request.json()

    // Validation
    if (!name || !date || !time || !location || !description || !category) {
      return NextResponse.json({ message: "All required fields must be provided" }, { status: 400 })
    }

    // Combine date and time
    const eventDateTime = new Date(`${date}T${time}`)

    const updateData = {
      name,
      date: eventDateTime,
      location,
      area: area || "",
      description,
      category,
      image: image || null,
      featured: featured || false,
      tags: tags || [],
      updatedAt: new Date(),
    }

    await db.collection("events").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    return NextResponse.json({ message: "Event updated successfully" })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error updating event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete event (authenticated, owner only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if event exists and user is the organizer
    const result = await db.collection("events").deleteOne({
      _id: new ObjectId(params.id),
      organizer: new ObjectId(decoded.userId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Event not found or you don't have permission to delete it" },
        { status: 404 },
      )
    }

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error deleting event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
