import { User } from "lib/db/models";
import { APIServerError } from "lib/errors/api/APIServerError";
import { hashing, verifyHash } from "lib/utils/hashing";
import { UpdatePasswordPayload } from "./dto";
import { APIValidationError } from "lib/errors/api/APIValidationError";
import { db } from "config/db";
import { authUsers, users } from "lib/db/schemas";
import { and, eq, isNull } from "drizzle-orm";

export async function updatePassword(
  req: Request,
  payload: UpdatePasswordPayload
): Promise<void> {
  // get data user
  const requestUser: string | null = req.headers.get("user");
  if (!requestUser) throw new APIServerError();
  const userData: User = JSON.parse(requestUser);

  // verified password
  const verified: boolean = await verifyHash(
    payload.currentPassword,
    userData.password
  );
  if (!verified) {
    throw new APIValidationError({
      currentPassword: "Current password is incorrect",
    });
  }

  // update password
  await db
    .update(users)
    .set({
      password: await hashing(payload.newPassword),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userData.id));

  // logout all devices?
  if (payload.logoutAllDevices) {
    await db
      .update(authUsers)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(
        and(eq(authUsers.userId, userData.id), isNull(authUsers.revokedAt))
      );
  }
}
