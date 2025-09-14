import { db } from "config/db";
import { and, desc, eq, gte, isNull } from "drizzle-orm";
import { User } from "lib/db/models";
import { authUsers } from "lib/db/schemas";
import { DeviceData } from "./dto";
import { UAParser } from "ua-parser-js";
import { APIServerError } from "lib/errors/api/APIServerError";

export async function getDevices(req: Request): Promise<DeviceData[]> {
  // get data user
  const requestUser: string | null = req.headers.get("user");
  if (!requestUser) throw new APIServerError();
  const userData: User = JSON.parse(requestUser);

  const auths: DeviceData[] = await db
    .selectDistinctOn([authUsers.deviceId], {
      id: authUsers.id,
      deviceId: authUsers.deviceId,
      ipAddress: authUsers.ip,
      userAgent: authUsers.userAgent,
      createdAt: authUsers.createdAt,
    })
    .from(authUsers)
    .where(
      and(
        eq(authUsers.userId, userData.id),
        isNull(authUsers.revokedAt),
        gte(authUsers.expiresAt, new Date())
      )
    )
    .orderBy(authUsers.deviceId, desc(authUsers.createdAt));

  const devices: DeviceData[] = [];
  for (const auth of auths) {
    const parser = new UAParser(auth.userAgent ?? "");

    devices.push({
      id: auth.id,
      deviceId: auth.deviceId,
      ipAddress: auth.ipAddress,
      userAgent: {
        browser: parser.getBrowser(),
        os: parser.getOS(),
        device: parser.getDevice(),
      },
      createdAt: auth.createdAt,
    });
  }

  return devices;
}
