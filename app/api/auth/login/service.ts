import { db } from "config/db";
import { and, desc, eq } from "drizzle-orm";
import { AuthUser, getTeamByUserId, User } from "lib/db/models";
import { authUsers, users } from "lib/db/schemas";
import { hashing, verifyHash } from "lib/utils/hashing";
import { LoginPayload, LoginResponse } from "./dto";
import { APIAuthenticationError } from "lib/errors/api/APIAuthenticationError";
import { createAccessToken, createRefreshToken } from "lib/utils/tokenize";
import { v4 as uuidV4 } from "uuid";
import { cookies } from "next/headers";

export async function login(
  req: Request,
  payload: LoginPayload
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
  const verifiedPassword: boolean = await verifyHash(
    payload.password,
    user.password
  );
  if (!verifiedPassword) {
    throw new APIAuthenticationError();
  }

  // get user team
  user.teams = await getTeamByUserId(user.id);

  // check device id
  let deviceId: string = cookies().get("deviceId")?.value ?? "";
  const userAgent: string = req.headers.get("user-agent")?.toString() ?? "";
  const ipAddress: string =
    req.headers.get("x-forwarded-for")?.toString() ?? "";

  if (deviceId) {
    const authDevice: AuthUser | undefined = await db.query.authUsers.findFirst(
      {
        where: and(
          eq(authUsers.deviceId, deviceId),
          eq(authUsers.userId, user.id)
        ),
        orderBy: [desc(authUsers.createdAt)],
      }
    );

    if (authDevice) {
      // verify device has same user agent
      const verifiedDevice: boolean = authDevice.userAgent === userAgent;

      if (!verifiedDevice) {
        throw new APIAuthenticationError();
      }
    }
  } else {
    // generate new device id
    deviceId = uuidV4();
  }

  // create user auth
  const accessToken: string = await createAccessToken(
    user.id,
    deviceId as string
  );

  const refreshToken: string = createRefreshToken();
  const now: Date = new Date();

  await db.insert(authUsers).values({
    userId: user.id,
    refreshToken: await hashing(refreshToken),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 hari
    userAgent: userAgent,
    ip: ipAddress,
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
    teams: user.teams,
  };
}
