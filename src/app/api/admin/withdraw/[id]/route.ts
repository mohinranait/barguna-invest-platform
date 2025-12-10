import { connectDB } from "@/lib/db";
import { isAuth } from "@/lib/helpers";
import { Transaction } from "@/models/transaction.model";
import { User } from "@/models/user.model";
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
        if ( !withdraw ) {
            return NextResponse.json({ error: "not-found" }, { status: 404 })
        }

        if(body?.status === 'approved'){
            // find user for add account balance
            const user = await User.findById(withdraw?.createdBy)
            if ( !user ) {
                return NextResponse.json({ error: "not-found" }, { status: 404 })
            }
            // incress balance and invested amount in deposit created user
            await User.findByIdAndUpdate(user?._id, { 
            withdrawAmount: user?.withdrawAmount + withdraw?.amount,
            balance: user?.balance - withdraw?.amount,
            },{new:true, runValidators:true});

            // Create transaction
            await Transaction.create({
                createdBy: user?._id,
                amount: withdraw?.amount,
                type: "withdraw",
                referenceId: withdraw?._id,
            })
        }


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