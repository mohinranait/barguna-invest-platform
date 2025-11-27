import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { User } from "@/models/user.model"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const authUser = await isAuth()

    if (!authUser || authUser?.userId === "") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findById(authUser.userId).select("-password").lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
