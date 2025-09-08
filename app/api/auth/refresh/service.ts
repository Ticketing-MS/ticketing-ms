import { db } from "config/db";
import { and, desc, eq, isNull } from "drizzle-orm";
import { AuthUser, User } from "lib/db/models";
import { authUsers } from "lib/db/schemas";
import { APIAuthenticationError } from "lib/errors/api/APIAuthenticationError";
import { APIServerError } from "lib/errors/api/APIServerError";
import { hashing, verifyHash } from "lib/utils/hashing";
import { createAccessToken, createRefreshToken } from "lib/utils/tokenize";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function refreshToken(
  req: Request
): Promise<Record<string, string>> {
  const deviceId = cookies().get("deviceId")?.value ?? "";

  // get auth user by device id
  const authUser: AuthUser[] = await db.query.authUsers.findMany({
    where: and(eq(authUsers.deviceId, deviceId)),
    orderBy: [desc(authUsers.createdAt)],
  });

  // if there are not recognized deviceId
  if (authUser.length === 0) {
    cookies().delete("refreshToken");
    cookies().delete("deviceId");
    throw new APIAuthenticationError();
  } else if (authUser[0].revokedAt !== null) {
    // verify deviceId with this refresh token has not logged out
    cookies().delete("refreshToken");
    cookies().delete("deviceId");

    throw new APIAuthenticationError();
  } else {
    // verify refresh token with new record
    const verified = await verifyHash(
      cookies().get("refreshToken")?.value ?? "",
      authUser[0].refreshToken
    );

    if (!verified) {
      // force logout all device with this deviceId
      await db
        .update(authUsers)
        .set({ revokedAt: new Date(), updatedAt: new Date() })
        .where(
          and(eq(authUsers.deviceId, deviceId), isNull(authUsers.revokedAt))
        );

      cookies().delete("refreshToken");
      cookies().delete("deviceId");

      throw new APIAuthenticationError();
    }

    // create new token and update to database
    const accessToken = await createAccessToken(authUser[0].userId);
    const refreshToken = createRefreshToken();

    await db
      .update(authUsers)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(eq(authUsers.id, authUser[0].id));
    await db.insert(authUsers).values({
      userId: authUser[0].userId,
      refreshToken: await hashing(refreshToken),
      expiresAt: authUser[0].expiresAt,
      userAgent: req.headers.get("user-agent"),
      ip:
        req.headers.get("x-forwarded-for") === "::1"
          ? "127.0.0.1"
          : req.headers.get("x-forwarded-for"),
      deviceId: authUser[0].deviceId,
    });

    return { accessToken, refreshToken, deviceId: authUser[0].deviceId };
  }
}
