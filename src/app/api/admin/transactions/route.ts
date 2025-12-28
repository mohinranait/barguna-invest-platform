import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { Transaction } from "@/models/transaction.model"
import { NextRequest, NextResponse } from "next/server"

// Get all transactions by specific admins 
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



    const query = {}

    const transactions = await Transaction.find(query).populate({
      path:"createdBy",
      select: 'fullName phone email'
    })

    if (!transactions) {
      return NextResponse.json({ error: "Transactions not found" }, { status: 404 })
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}





