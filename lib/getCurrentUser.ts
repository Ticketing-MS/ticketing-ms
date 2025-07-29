import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET!;

export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "string") return null;
    return decoded;
  } catch {
    return null;
  }
}
