import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { Deposit } from "@/models/deposit.model"
import { NextRequest, NextResponse } from "next/server"

// Create new deposit
export async function POST(req:NextRequest) {
    try {

        await connectDB()

        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const newDeposit = await Deposit.create({...body})

        return NextResponse.json(
            {
                deposit: newDeposit
            },
            { status: 201 },
        )

    } catch (error) {
        console.error("Deposit error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


// Get all deposits by specific user 
export async function GET(req: NextRequest) {
  try {
    // Connect DB
    await connectDB()
    // Checked authentication
    const authUser = await isAuth()
    if (!authUser || authUser?.userId === "") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    

    const query = {
        createdBy: authUser.userId
    }

    const deposits = await Deposit.find(query).lean()

    if (!deposits) {
      return NextResponse.json({ error: "Deposits not found" }, { status: 404 })
    }

    return NextResponse.json({ deposits, message:'success' },{ status: 200 })
  } catch (error) {
    console.error("Get deposits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}