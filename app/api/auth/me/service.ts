import { LoginResponse } from "app/api/auth/login/dto";
import { db } from "config/db";
import { logger } from "config/winston";
import { eq } from "drizzle-orm";
import { User } from "lib/db/models";
import { users } from "lib/db/schemas";
import { APIAuthenticationError } from "lib/errors/api/APIAuthenticationError";
import { APIServerError } from "lib/errors/api/APIServerError";

export async function getProfile(req: Request): Promise<LoginResponse> {
  const requestUser = req.headers.get("user");
  if (!requestUser) throw new APIServerError();

  // get data user
  const userData: User = JSON.parse(requestUser);
  const user = (await db.query.users.findFirst({
    where: eq(users.id, userData.id),
    with: {
      role: true,
    },
  })) as (User & { role: User["role"] | null }) | undefined;

  if (user === undefined) {
    throw new APIAuthenticationError();
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
  };
}
