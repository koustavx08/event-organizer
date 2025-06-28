import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// POST - Create RSVP
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const { eventId, name, email, phone, notes } = await request.json()

    // Validation
    if (!eventId || !name || !email) {
      return NextResponse.json({ message: "Event ID, name, and email are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if event exists
    const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) })
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    // Check if user already has an RSVP for this event
    const existingRSVP = await db.collection("rsvps").findOne({
      eventId: new ObjectId(eventId),
      userId: new ObjectId(decoded.userId),
    })

    if (existingRSVP) {
      // Return the existing RSVP instead of an error for demo purposes
      return NextResponse.json({
        message: "RSVP already exists",
        rsvp: existingRSVP,
      })
    }

    // Generate unique QR code
    const qrCode = `rsvp_${eventId}_${decoded.userId}_${Date.now()}`

    // Create RSVP
    const rsvpData = {
      eventId: new ObjectId(eventId),
      userId: new ObjectId(decoded.userId),
      userName: name,
      userEmail: email,
      phone: phone || null,
      notes: notes || null,
      status: "confirmed",
      checkedIn: false,
      qrCode,
      createdAt: new Date(),
    }

    const result = await db.collection("rsvps").insertOne(rsvpData)

    // Update event RSVP count
    await db.collection("events").updateOne({ _id: new ObjectId(eventId) }, { $inc: { rsvpCount: 1 } })

    return NextResponse.json({
      message: "RSVP created successfully",
      rsvp: {
        _id: result.insertedId,
        ...rsvpData,
      },
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error creating RSVP:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
