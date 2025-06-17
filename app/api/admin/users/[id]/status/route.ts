import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// PATCH - Update user status (admin only)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any

    const { db } = await connectToDatabase()

    // Check if user is admin
    const adminUser = await db.collection("users").findOne({
      _id: new ObjectId(decoded.userId),
      role: "admin",
    })

    if (!adminUser) {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const { status } = await request.json()

    // Validate status
    if (!["active", "blocked"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 })
    }

    // Update user status
    const result = await db.collection("users").updateOne({ _id: new ObjectId(params.id) }, { $set: { status } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User status updated successfully" })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    console.error("Error updating user status:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
