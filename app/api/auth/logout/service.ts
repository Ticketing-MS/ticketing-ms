import { LoginResponse } from "app/api/auth/login/dto";
import { db } from "config/db";
import { logger } from "config/winston";
import { and, desc, eq } from "drizzle-orm";
import { AuthUser, User } from "lib/db/models";
import { authUsers, users } from "lib/db/schemas";
import { APIAuthenticationError } from "lib/errors/api/APIAuthenticationError";
import { APIServerError } from "lib/errors/api/APIServerError";
import { cookies } from "next/headers";

export async function logout(req: Request): Promise<void> {
  const requestUser = req.headers.get("user");
  if (!requestUser) throw new APIServerError();

  const userData: User = JSON.parse(requestUser);

  // get auth user
  const authUser: AuthUser | undefined = await db.query.authUsers.findFirst({
    where: and(
      eq(authUsers.userId, userData.id),
      eq(authUsers.deviceId, cookies().get("deviceId")?.value ?? "")
    ),
    orderBy: [desc(authUsers.createdAt)],
  });

  if (!authUser) {
    throw new APIAuthenticationError();
  }

  // update auth user
  await db
    .update(authUsers)
    .set({ revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(authUsers.id, authUser.id));
}
