import { connectDB } from "@/lib/db";
import { isAuth } from "@/lib/helpers";
import { Withdrawal } from "@/models/wthdrawal.model";
import { NextRequest, NextResponse } from "next/server";

// Update withdraw request 
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {

        await connectDB()

        const withdrawId = params.id;
       

        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
            return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const withdraw = await Withdrawal.findByIdAndUpdate(withdrawId,{...body},{new:true, runValidators:true})

        return NextResponse.json(
            {
                withdraw
            },
            { status: 200 },
        )

    } catch (error) {
        console.error("Withdraw error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}