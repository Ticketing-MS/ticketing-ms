import { db } from "config/db";
import { and, eq, isNull } from "drizzle-orm";
import { AuthUser, User } from "lib/db/models";
import { authUsers } from "lib/db/schemas";
import { APIAuthenticationError } from "lib/errors/api/APIAuthenticationError";
import { APIServerError } from "lib/errors/api/APIServerError";
import { cookies } from "next/headers";

export async function logout(req: Request): Promise<void> {
  // get user data
  const requestUser: string | null = req.headers.get("user");
  if (!requestUser) throw new APIServerError();
  const userData: User = JSON.parse(requestUser);

  // get auth user
  const deviceId: string = cookies().get("deviceId")?.value ?? "";
  const authUser: AuthUser[] = await db.query.authUsers.findMany({
    where: and(
      eq(authUsers.userId, userData.id),
      eq(authUsers.deviceId, deviceId ?? ""),
      isNull(authUsers.revokedAt)
    ),
  });

  if (authUser.length === 0) {
    throw new APIAuthenticationError();
  }

  // update auth user
  await db
    .update(authUsers)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(authUsers.deviceId, deviceId ?? ""),
        isNull(authUsers.revokedAt),
        eq(authUsers.userId, userData.id)
      )
    );
}
