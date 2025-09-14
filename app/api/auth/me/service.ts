import { LoginResponse } from "app/api/auth/login/dto";
import { db } from "config/db";
import { and, eq, not } from "drizzle-orm";
import { getTeamByUserId, User } from "lib/db/models";
import { users } from "lib/db/schemas";
import { APIAuthenticationError } from "lib/errors/api/APIAuthenticationError";
import { APIServerError } from "lib/errors/api/APIServerError";
import { UpdateProfilePayload } from "./dto";
import cloudinary from "config/cloudinary";
import { APIResponseError } from "lib/errors/api/APIResponseError";
import { APIValidationError } from "lib/errors/api/APIValidationError";
import { logger } from "config/winston";

export async function getProfile(req: Request): Promise<LoginResponse> {
  // get data user
  const requestUser: string | null = req.headers.get("user");
  if (!requestUser) throw new APIServerError();
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

  // get user team
  user.teams = await getTeamByUserId(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
    teams: user.teams,
  };
}

export async function updateProfile(
  req: Request,
  payload: UpdateProfilePayload
): Promise<void> {
  // get data user
  const requestUser: string | null = req.headers.get("user");
  if (!requestUser) throw new APIServerError();
  const userData: User = JSON.parse(requestUser);
  const updatedData: Record<string, any> = {
    name: payload.name,
    email: payload.email,
    updatedAt: new Date(),
  };

  if (payload.avatar) {
    // get public id
    const regex = /avatars\/.*/;
    const match = regex.exec(userData.avatarUrl ?? "");
    let publicId = "";
    if (match && match[0]) publicId = match[0].split(".")[0];

    // delete old image from cloudinary
    await cloudinary.api.delete_resources([publicId]);

    // upload image to cloudinary
    const arrayBuffer: ArrayBuffer = await payload.avatar.arrayBuffer();
    const buffer: Buffer = Buffer.from(arrayBuffer);
    const result: any = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_chunked_stream(
          { access_mode: "public", folder: "avatars" },
          (error, uploadResult) => {
            if (error) {
              throw new APIServerError();
            } else {
              resolve(uploadResult);
            }
          }
        )
        .end(buffer);
    });
    updatedData.avatarUrl = result.secure_url;
  }

  // check unique email
  const existEmail: User | undefined = await db.query.users.findFirst({
    where: and(not(eq(users.id, userData.id)), eq(users.email, payload.email)),
  });

  if (existEmail) {
    throw new APIValidationError({ email: "Email already in used" });
  }

  // update data
  await db.update(users).set(updatedData).where(eq(users.id, userData.id));
}
