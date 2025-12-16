import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { Kyc } from "@/models/kyc.model"
import { NextRequest, NextResponse } from "next/server"

// Create new KYC
export async function POST(req:NextRequest) {
    try {

        await connectDB()

        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // If not exists, then will be create otherwish update kyc
        const body = await req.json()
        const kyc = await Kyc.findOneAndUpdate(
            { userId: authUser.userId},
            { $set: body },
            {
                new:true,
                upsert:true,
                runValidators:true,
            }
        )

        return NextResponse.json(
            {
                kyc
            },
            { status: 201 },
        )

    } catch (error) {
        console.error("Kyc error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


// Get authenticated user kyc
export async function GET(req:NextRequest){
    try {
        const authUser = await isAuth();
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // get kyc by auth user
        const kyc = await Kyc.findOne({userId: authUser?.userId })
        return NextResponse.json({
            kyc,
        },{
            status:200
        })

    } catch (error) {
        console.error("Kyc error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}