import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { Withdrawal } from "@/models/wthdrawal.model"
import { NextRequest, NextResponse } from "next/server"

// Get all withdrawals by specific user 
export async function GET(req: NextRequest) {
  try {
    // Connect DB
    await connectDB()
    // Checked authentication
    const authUser = await isAuth()
    if (!authUser || authUser?.userId === "") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
        return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
    }
    
    

    const query = { }

    const withdrawals = await Withdrawal.find(query).populate({
        path:"createdBy",
        select: 'fullName email phone'
    }).sort({ createdAt: -1 }).lean()

    if (!withdrawals) {
      return NextResponse.json({ error: "Withdraw not found" }, { status: 404 })
    }

    return NextResponse.json({ withdrawals, message:'success' },{ status: 200 })
  } catch (error) {
    console.error("Get withdrawals error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

