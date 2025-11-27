import { connectDB } from "@/lib/db"
import bcrypt from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"
import { User } from "@/models/user.model"
import { generateToken } from "@/lib/helpers"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password, fullName, phone } = await req.json()

    if (!email || !password || !fullName || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        phone,
        role: "member",
        status: "pending",
    })

    const token = generateToken(newUser._id.toString(), newUser.role)

    return NextResponse.json(
      {
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
