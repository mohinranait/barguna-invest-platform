import mongoose from "mongoose"

let cachedConnection: typeof mongoose | null = null

const MONGODB_URI = process.env.NEXT_PUBLIC_DATABASE_URL

export async function connectDB() {
  
  if (cachedConnection) {
    return cachedConnection
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined")
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI)
    cachedConnection = conn
    console.log("MongoDB connected successfully")
    return conn
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

export async function disconnectDB() {
  if (cachedConnection) {
    await cachedConnection.disconnect()
    cachedConnection = null
  }
}
