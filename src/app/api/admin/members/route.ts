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

    if (!authUser || (authUser.role !== "admin" && authUser.role !== "manager")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const members = await User.find().select("-password").sort({ createdAt: -1 }).lean()

    return NextResponse.json({ members })
  } catch (error) {
    console.error("Members list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
