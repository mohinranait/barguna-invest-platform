import { connectDB } from "@/lib/db"
import { isAuth } from "@/lib/helpers"
import { User } from "@/models/user.model"
import { type NextRequest, NextResponse } from "next/server"

// Get profile information for authenticated user
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const authUser = await isAuth()

    if (!authUser || authUser?.userId === "") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await User.findById(authUser.userId).select("-password").lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


// Update user
export async function PATCH(req: NextRequest) {
    try {

        await connectDB()

      
        const authUser = await isAuth()
        if (!authUser || authUser?.userId === "") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }


        const body = await req.json()
        const user = await User.findByIdAndUpdate(authUser?.userId,{...body },{new:true, runValidators:true})
        if ( !user ) {
            return NextResponse.json({ error: "not-found" }, { status: 404 })
        }
           
        return NextResponse.json( 
            {
                user
            },
            { status: 200 },
        )

    } catch (error) {
        console.error("User error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
