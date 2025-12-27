// get kyc by user id
import { connectDB } from "@/lib/db";
import { isAuth } from "@/lib/helpers";
import { Kyc } from "@/models/kyc.model";
import { NextRequest, NextResponse } from "next/server";

// Get kyc by user ID
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {

        await connectDB()   
        const {id:userId} = await context.params;
        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
            return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
        }
        const kyc = await Kyc.findOne({ userId })


        return NextResponse.json(
            {
                kyc
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Kyc error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}