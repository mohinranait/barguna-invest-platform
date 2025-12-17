import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { Kyc } from "@/models/kyc.model"
import { NextRequest, NextResponse } from "next/server"

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

    const kycs = await Kyc.find({status: "Pending"}).populate({
        path:'userId',
        select: 'fullName'
    }).sort({ createdAt: -1 }).lean()

    return NextResponse.json({ kycs })
  } catch (error) {
    console.error("Kyc list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}