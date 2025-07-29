import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;

export async function POST() {
  const token = cookies().get("token")?.value;

  if (!token) {
    console.log("token not found");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, secret);

    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, decoded.id));
    return NextResponse.json({ message: "Heartbeat updated" });
  } catch (err) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
