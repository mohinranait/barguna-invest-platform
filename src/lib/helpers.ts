import jwt, { JwtPayload } from "jsonwebtoken"
import { cookies } from "next/headers";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your-super-secret-key"

// Generate JWT Token
export function generateToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" })
}

// Verify JWT Token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch (error) {
    console.log({error});
    return null
  }
}


interface DecodedToken extends JwtPayload {
  userId: string;
  role: string;
}

// GET TOKEN INFORMATION
export const isAuth = async (): Promise<DecodedToken | null> => {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  if (!token) {
    return {
      userId: "",
      role: "",
    };
  }

  const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
  return decoded;
};

