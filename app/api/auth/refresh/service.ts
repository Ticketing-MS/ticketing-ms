import { db } from "config/db";
import { and, desc, eq, isNull } from "drizzle-orm";
import { AuthUser } from "lib/db/models";
import { authUsers } from "lib/db/schemas";
import { APIAuthenticationError } from "lib/errors/api/APIAuthenticationError";
import { hashing, verifyHash } from "lib/utils/hashing";
import { createAccessToken, createRefreshToken } from "lib/utils/tokenize";
import { cookies } from "next/headers";

export async function refreshToken(
  req: Request
): Promise<Record<string, string>> {
  const deviceId: string = cookies().get("deviceId")?.value ?? "";

  // get auth user by device id
  const authUser: AuthUser[] = await db.query.authUsers.findMany({
    where: and(eq(authUsers.deviceId, deviceId)),
    orderBy: [desc(authUsers.createdAt)],
  });

  // if there are not recognized deviceId
  if (authUser.length === 0) {
    cookies().delete("refreshToken");
    throw new APIAuthenticationError();
  } else if (authUser[0].revokedAt !== null) {
    // verify device id with new refresh token haven't logout
    cookies().delete("refreshToken");
    throw new APIAuthenticationError();
  } else {
    // verify refresh token with new record
    const verified: boolean = await verifyHash(
      cookies().get("refreshToken")?.value ?? "",
      authUser[0].refreshToken
    );

    // if unverified or expired
    if (!verified || authUser[0].expiresAt < new Date()) {
      // force logout with this device id
      await db
        .update(authUsers)
        .set({ revokedAt: new Date(), updatedAt: new Date() })
        .where(
          and(eq(authUsers.deviceId, deviceId), isNull(authUsers.revokedAt))
        );

      cookies().delete("refreshToken");
      throw new APIAuthenticationError();
    }

    // create new token and update to database
    const accessToken: string = await createAccessToken(
      authUser[0].userId,
      deviceId
    );
    const refreshToken: string = createRefreshToken();

    await db
      .update(authUsers)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(eq(authUsers.id, authUser[0].id));
    await db.insert(authUsers).values({
      userId: authUser[0].userId,
      refreshToken: await hashing(refreshToken),
      expiresAt: authUser[0].expiresAt,
      userAgent: req.headers.get("user-agent"),
      ip: req.headers.get("x-forwarded-for"),
      deviceId: authUser[0].deviceId,
    });

    return { accessToken, refreshToken, deviceId: authUser[0].deviceId };
  }
}
