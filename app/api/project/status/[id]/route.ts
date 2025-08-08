import { NextRequest, NextResponse } from "next/server";
import { db } from "db";
import { tickets, ticketStatuses } from "db/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const statusId = params.id;

    // optional: ?moveTo=<statusId lain di project yang sama>
    const { searchParams } = new URL(req.url);
    const moveTo = searchParams.get("moveTo");

    // 1) Cek status ada?
    const current = await db.query.ticketStatuses.findFirst({
      where: eq(ticketStatuses.id, statusId),
    });
    if (!current) {
      return NextResponse.json({ success: false, error: "Status not found" }, { status: 404 });
    }

    // 2) Ambil tiket yang pakai status ini
    const affected = await db
      .select({ id: tickets.id })
      .from(tickets)
      .where(eq(tickets.statusId, statusId));

    // 3) Kalau ada tiket & tidak ada moveTo -> tolak
    if (affected.length > 0 && !moveTo) {
      return NextResponse.json(
        { success: false, error: "This column has tickets. Provide ?moveTo=<anotherStatusId> to move them first." },
        { status: 400 }
      );
    }

    // 4) Kalau ada moveTo, validasi status target di project yang sama
    if (affected.length > 0 && moveTo) {
      const target = await db.query.ticketStatuses.findFirst({
        where: and(
          eq(ticketStatuses.id, moveTo),
          eq(ticketStatuses.projectId, current.projectId)
        ),
      });
      if (!target) {
        return NextResponse.json(
          { success: false, error: "Invalid moveTo status" },
          { status: 400 }
        );
      }

      // Pindahkan semua tiket ke status target
      await db
        .update(tickets)
        .set({ statusId: moveTo })
        .where(eq(tickets.statusId, statusId));
    }

    // 5) Hapus status
    await db.delete(ticketStatuses).where(eq(ticketStatuses.id, statusId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /project/status/[id] error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
