import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { Transaction } from "@/models/transaction.model"
import { NextRequest, NextResponse } from "next/server"

// Update withdraw request -> transaction
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {

        await connectDB()

        const {id} = await context.params;
       

        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
            return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const transaction = await Transaction.findByIdAndUpdate(id,{...body},{new:true, runValidators:true})

        return NextResponse.json(
            {
                transaction
            },
            { status: 200 },
        )

    } catch (error) {
        console.error("Transaction error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

