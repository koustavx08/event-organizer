import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Find user
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Check if user is blocked
    if (user.status === "blocked") {
      return NextResponse.json({ message: "Your account has been blocked. Please contact support." }, { status: 403 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || "your-secret-key", {
      expiresIn: "7d",
    })

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
