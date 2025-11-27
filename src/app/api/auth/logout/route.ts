import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logout success",success:true }, { status: 200 });
    response.cookies.set({
      name: "token",
      value: "",
      path: "/",
      httpOnly: true,
      maxAge: 0,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}