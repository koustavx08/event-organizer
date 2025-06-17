import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// POST - Check in attendee using QR code
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const { qrCode, eventId } = await request.json()

    if (!qrCode || !eventId) {
      return NextResponse.json({ message: "QR code and event ID are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Verify that the user is the organizer of the event
    const event = await db.collection("events").findOne({
      _id: new ObjectId(eventId),
      organizer: new ObjectId(decoded.userId),
    })

    if (!event) {
      return NextResponse.json({ message: "Event not found or you don't have permission" }, { status: 404 })
    }

    // Find the RSVP by QR code
    const rsvp = await db.collection("rsvps").findOne({
      qrCode,
      eventId: new ObjectId(eventId),
      status: "confirmed",
    })

    if (!rsvp) {
      return NextResponse.json({ message: "Invalid QR code or RSVP not found" }, { status: 404 })
    }

    const wasAlreadyCheckedIn = rsvp.checkedIn

    // Update check-in status
    await db.collection("rsvps").updateOne(
      { _id: rsvp._id },
      {
        $set: {
          checkedIn: true,
          checkedInAt: new Date(),
        },
      },
    )

    // Update event checked-in count if this is a new check-in
    if (!wasAlreadyCheckedIn) {
      await db.collection("events").updateOne({ _id: new ObjectId(eventId) }, { $inc: { checkedInCount: 1 } })
    }

    return NextResponse.json({
      message: wasAlreadyCheckedIn ? "Attendee was already checked in" : "Check-in successful",
      attendee: {
        name: rsvp.userName,
        email: rsvp.userEmail,
        rsvpId: rsvp._id.toString(),
        checkedIn: wasAlreadyCheckedIn,
      },
    })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error checking in attendee:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
