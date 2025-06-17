import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Determine if this is the first user (make them admin)
    const userCount = await db.collection("users").countDocuments()
    const role = userCount === 0 ? "admin" : "attendee"

    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      status: "active",
      createdAt: new Date(),
    })

    // Generate JWT token
    const token = jwt.sign({ userId: result.insertedId, email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: {
        id: result.insertedId,
        name,
        email,
        role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
