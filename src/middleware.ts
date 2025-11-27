import {  NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_LOGIN = process.env.NEXT_PUBLIC_JWT_SECRET ;
export async function middleware (request: NextRequest){
    const token = request.cookies.get("token")?.value;
    const {pathname} = request.nextUrl;
    
    if (!token) {   
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {

        const secret = new TextEncoder().encode(JWT_LOGIN);
        const {payload} = await jwtVerify(token, secret)

        console.log({payload});
        

        //  No authenticated user role found
        if (!payload?.role || (payload.role !== "admin" && payload.role !== "member" && payload.role !== "manager")) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        
        if(payload?.role === 'member' ){
            if (pathname.startsWith("/admin")) {
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
        }

        return NextResponse.next();

    } catch (error) {
        console.log("Error block ");
        
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
     matcher: ["/admin/:path*", "/dashboard/:path*"],
}