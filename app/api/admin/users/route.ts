import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// GET - Fetch all users (admin only)
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

    // Fetch all users with event counts
    const users = await db
      .collection("users")
      .aggregate([
        {
          $lookup: {
            from: "events",
            localField: "_id",
            foreignField: "organizer",
            as: "events",
          },
        },
        {
          $lookup: {
            from: "rsvps",
            localField: "_id",
            foreignField: "userId",
            as: "rsvps",
          },
        },
        {
          $addFields: {
            eventsCreated: { $size: "$events" },
            eventsAttended: {
              $size: {
                $filter: {
                  input: "$rsvps",
                  as: "rsvp",
                  cond: { $eq: ["$$rsvp.checkedIn", true] },
                },
              },
            },
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
            role: 1,
            status: 1,
            createdAt: 1,
            eventsCreated: 1,
            eventsAttended: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray()

    return NextResponse.json({ users })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
