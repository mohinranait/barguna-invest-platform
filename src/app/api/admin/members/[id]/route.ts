import { connectDB } from "@/lib/db";
import { isAuth } from "@/lib/helpers";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

// GET user by id
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id:userId } = await context.params;
   
    try {
        // Checked authentication and authorization
        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
    
        // Only admin and manager can access this route
        if (!authUser || (authUser.role !== "admin" && authUser.role !== "manager")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // Connect to DB and fetch user by userId
        await connectDB();

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}