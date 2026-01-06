
import { ProfitDistribution } from "@/models/profit-distribution.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    // This is a placeholder for the actual implementation.
    // You would typically fetch the distribution details from the database using the provided ID.

    const {id} = await context.params;

    try {
        const distributions = await ProfitDistribution.find({distribution: id}).populate({
            path: "ownerBy",
            select: "fullName"
        }).lean();

        return NextResponse.json({ distributions, message:'success' },{ status: 200 })
    } catch (error) {
        console.error("Distribution error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}