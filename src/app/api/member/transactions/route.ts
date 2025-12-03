import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { Transaction } from "@/models/transaction.model"
import { type NextRequest, NextResponse } from "next/server"

// Get all transactions by specific user 
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
        userId: authUser.userId
    }

    const transactions = await Transaction.find(query).lean()

    if (!transactions) {
      return NextResponse.json({ error: "Transactions not found" }, { status: 404 })
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


// Create new transaction
export async function POST(req:NextRequest) {
    try {

        await connectDB()

        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const newTransaction = await Transaction.create({...body})

        return NextResponse.json(
            {
                transaction: newTransaction
            },
            { status: 201 },
        )

    } catch (error) {
        console.error("Transaction error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
