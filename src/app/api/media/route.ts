import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";

import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import { CLOUDINARY_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET } from "@/lib/accessEnv";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});


export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const tempFilePath = path.join(os.tmpdir(), `${nanoid()}_${file.name}`);
    await writeFile(tempFilePath, buffer);

    const result = await cloudinary.uploader.upload(tempFilePath, {
      folder: "barguna",
    });


    const { url, format, width, height, bytes: iBytes, secure_url, public_id } = result;


    const media = {
      fileUrl: url,
      width,
      height,
      extension: format,
      size: iBytes,
      public_id,
      secure_url,
    }




    return NextResponse.json({
      success: true,
      payload: {
        file: media,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
