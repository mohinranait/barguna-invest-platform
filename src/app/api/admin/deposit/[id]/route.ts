import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { Deposit } from "@/models/deposit.model"
import { NextRequest, NextResponse } from "next/server"

// Update deposit request for admin approval
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        await connectDB()

        const transId = params.id;
        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
            return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const deposit = await Deposit.findByIdAndUpdate(transId,{...body},{new:true, runValidators:true})

        return NextResponse.json(
            {
                deposit
            },
            { status: 200 },
        )

    } catch (error) {
        console.error("Deposit error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

