import { db } from "config/db";
import { eq } from "drizzle-orm";
import { User } from "lib/db/models";
import { authUsers, users } from "lib/db/schemas";
import { hashing, verifyHash } from "lib/utils/hashing";
import { LoginData, LoginResponse } from "./dto";
import { APIAuthenticationError } from "lib/errors/api/APIAuthenticationError";
import { createAccessToken, createRefreshToken } from "lib/utils/tokenize";
import { v4 as uuidV4 } from "uuid";

export async function login(
  req: Request,
  payload: LoginData
): Promise<LoginResponse> {
  // check email
  const user = (await db.query.users.findFirst({
    where: eq(users.email, payload.email),
    with: {
      role: true,
    },
  })) as (User & { role: User["role"] | null }) | undefined;

  if (user === undefined) {
    throw new APIAuthenticationError();
  }

  // check password
  const verified: boolean = await verifyHash(payload.password, user.password);
  if (!verified) {
    throw new APIAuthenticationError();
  }

  // create user auth
  const accessToken = await createAccessToken(user.id);
  const refreshToken = createRefreshToken();
  const deviceId = uuidV4();
  const now = new Date();

  await db.insert(authUsers).values({
    userId: user.id,
    refreshToken: await hashing(refreshToken),
    expiresAt: new Date(now.setHours(now.getHours() + 24)),
    userAgent: req.headers.get("user-agent"),
    ip:
      req.headers.get("x-forwarded-for") === "::1"
        ? "127.0.0.1"
        : req.headers.get("x-forwarded-for"),
    deviceId,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
    auth: {
      accessToken,
      refreshToken,
      deviceId,
    },
  };
}
