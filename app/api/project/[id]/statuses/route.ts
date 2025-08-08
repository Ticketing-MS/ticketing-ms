import { db } from "db";
import { ticketStatuses } from "db/schema";
import { eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// GET: ambil semua status untuk project tertentu
export async function GET(_: Request, { params }: { params: { projectId: string } }) {
  const data = await db
    .select()
    .from(ticketStatuses)
    .where(eq(ticketStatuses.projectId, params.projectId))
    .orderBy(asc(ticketStatuses.order));

  return NextResponse.json(data);
}

// POST: tambahkan status baru
export async function POST(req: Request, { params }: { params: { projectId: string } }) {
  const body = await req.json();
  const { name } = body;

  const result = await db
    .insert(ticketStatuses)
    .values({
      id: uuidv4(),
      projectId: params.projectId,
      name,
      order: name.toLowerCase(), // bisa juga urutan numerik
    })
    .returning();

  return NextResponse.json(result[0]);
}