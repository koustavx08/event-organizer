import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Check if user has RSVP for event
export async function GET(request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    if (!ObjectId.isValid(params.eventId)) {
      return NextResponse.json({ message: "Invalid event ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const rsvp = await db.collection("rsvps").findOne({
      eventId: new ObjectId(params.eventId),
      userId: new ObjectId(decoded.userId),
      status: "confirmed",
    })

    if (!rsvp) {
      return NextResponse.json({ rsvp: null })
    }

    return NextResponse.json({ rsvp })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error checking RSVP:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
