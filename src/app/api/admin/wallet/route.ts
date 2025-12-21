import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { CompanyWallet } from "@/models/CompanyWallet.model"
import { NextRequest, NextResponse } from "next/server"


// Get wallet data 
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
    

    const wallet = await CompanyWallet.findOne({});

    return NextResponse.json({ wallet, message:'success' },{ status: 200 })
  } catch (error) {
    console.error("Get wallet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}