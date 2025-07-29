import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET!;

// getCurrentUser
export async function getCurrentUser() {
  const token = cookies().get("token")?.value;

  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    return user;
  } catch (err) {
    console.error("JWT verify error:", err); // ⬅️ Log error JWT
    return null;
  }
}
