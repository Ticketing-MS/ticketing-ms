import { db } from "db";
import { tickets, ticketStatuses } from "db/schema";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import slugify from "slugify";
import { getCurrentUser } from "lib/auth"; // pastikan path ini sesuai

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      assignee,
      labels = [],
      dueDate,
      projectId,
      userId,
      team = "",
      statusId: incomingStatusId,
    } = body;

    // 🛡️ Auth: validasi user aktif
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🛡️ Role validation: hanya boleh buat tiket untuk tim tertentu
    const allowedTeams =
      currentUser.role === "pm" ? ["cloud", "devops"] : [currentUser.team];

    if (!allowedTeams.includes(team)) {
      return NextResponse.json(
        {
          success: false,
          error: `You are not allowed to create tickets for team "${team}"`,
        },
        { status: 403 }
      );
    }

    // ✅ Validasi field wajib
    if (!title || !description || !userId || !projectId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Ambil status default jika tidak dikirim
    let selectedStatusId = incomingStatusId;
    if (!selectedStatusId) {
      const defaultStatus = await db.query.ticketStatuses.findFirst({
        where: (s) => eq(s.projectId, projectId),
      });
      if (!defaultStatus) {
        return NextResponse.json(
          {
            success: false,
            error: "Please add at least one status before creating tickets.",
          },
          { status: 400 }
        );
      }
      selectedStatusId = defaultStatus.id;
    }

    // 🔁 Generator referenceCode unik
    const referenceCode = await generateUniqueReferenceCode();

    // 🔁 Slugify title
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    while (true) {
      const exists = await db.query.tickets.findFirst({
        where: eq(tickets.slug, slug),
      });
      if (!exists) break;
      slug = `${baseSlug}-${count++}`;
    }

    // 🏷️ Normalisasi label
    const normalizedLabels = labels.map((l: string) =>
      l.trim().toLowerCase()
    );

    // 💾 Simpan ke DB
    const newTicketId = uuidv4();
    await db.transaction(async (tx) => {
      await tx.insert(tickets).values({
        id: newTicketId,
        title,
        slug,
        description,
        assignedTo: assignee || null,
        projectId,
        team,
        userId,
        createdBy: userId,
        dueDate: dueDate ? new Date(dueDate) : null,
        referenceCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        labels: normalizedLabels,
        statusId: selectedStatusId,
      });
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: newTicketId,
        slug,
        title,
        referenceCode,
        projectId,
        team,
      },
    });
  } catch (err) {
    console.error("Create Ticket Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

// 🔧 Generator unik untuk referenceCode
async function generateUniqueReferenceCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  let isUnique = false;

  while (!isUnique) {
    code = Array.from({ length: 8 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");

    const exists = await db.query.tickets.findFirst({
      where: (t) => eq(t.referenceCode, code),
    });

    if (!exists) isUnique = true;
  }

  return code;
}
