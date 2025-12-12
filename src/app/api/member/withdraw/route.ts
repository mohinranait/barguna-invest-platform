import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { User } from "@/models/user.model"
import { Withdrawal } from "@/models/wthdrawal.model"
import { NextRequest, NextResponse } from "next/server"

// Create new withdraw
export async function POST(req:NextRequest) {
    try {

        await connectDB()

        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Checked balance
        const user = await User.findById(authUser?.userId);
        const body = await req.json()
        if( user?.balance < body?.amount ){
           return NextResponse.json({ error: "Insufficient balance" }, { status: 403 })
        }


        const newWithdraw = await Withdrawal.create({...body})

        return NextResponse.json(
            {
                withdraw: newWithdraw
            },
            { status: 201 },
        )

    } catch (error) {
        console.error("Withdraw error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


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
    

    const query = {
        createdBy: authUser.userId
    }

    const withdrawals = await Withdrawal.find(query).lean()

    if (!withdrawals) {
      return NextResponse.json({ error: "Withdraw not found" }, { status: 404 })
    }

    return NextResponse.json({ withdrawals, message:'success' },{ status: 200 })
  } catch (error) {
    console.error("Get withdrawals error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}