// /app/api/project/update-status/route.ts
import { db } from "db";
import { ticketStatuses, tickets } from "db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Move ticket to another status
export async function POST(req: NextRequest) {
  try {
    const { id, newStatusId } = await req.json();
    if (!id || !newStatusId) {
      return NextResponse.json(
        { success: false, error: "Missing fields: id or newStatusId" },
        { status: 400 }
      );
    }

    await db
      .update(tickets)
      .set({ statusId: newStatusId, updatedAt: new Date() })
      .where(eq(tickets.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Move ticket error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to move ticket" },
      { status: 500 }
    );
  }
}

// Rename a status column
export async function PUT(req: NextRequest) {
  try {
    const { statusId, newName } = await req.json();
    if (!statusId || !newName) {
      return NextResponse.json(
        { success: false, error: "Missing fields: statusId or newName" },
        { status: 400 }
      );
    }

    await db
      .update(ticketStatuses)
      .set({ name: newName })
      .where(eq(ticketStatuses.id, statusId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update status error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update status" },
      { status: 500 }
    );
  }
}
