import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { CompanyOperation } from "@/models/company-operation.model"
import { CompanyWallet } from "@/models/CompanyWallet.model"
import { ICompanyOperation } from "@/types/company-operation.type"

import { NextRequest, NextResponse } from "next/server"


// Create new profit
export async function POST(req:NextRequest) {
    try {

        await connectDB()

        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        if ( authUser?.role !== "manager" && authUser?.role !== 'admin' ) {
            return NextResponse.json({ error: "Access Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const profit = await CompanyOperation.create({...body}) as unknown as ICompanyOperation ;
        if ( !profit ) {
            return NextResponse.json({ error: "Not created" }, { status: 401 })
        }

        

       


        await CompanyWallet.findOneAndUpdate({},{
            $inc: {
                availableBalance: body?.type === 'income' ? profit?.amount : -profit?.amount,
            }
        },{new :true, runValidators:true})

        return NextResponse.json(
            {
                 profit
            },
            { status: 201 },
        )

    } catch (error) {
        console.error("Profit error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


// Get all profits for admin and manager 
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

    const profits = await CompanyOperation.find(query).populate({
      path:"createdBy",
      select: 'fullName phone email'
    }).populate({
      path:"updatedBy",
      select: 'fullName phone email'
    }).lean()

    if (!profits) {
      return NextResponse.json({ error: "Profits not found" }, { status: 404 })
    }

    return NextResponse.json({ profits, message:'success' },{ status: 200 })
  } catch (error) {
    console.error("Get profits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}