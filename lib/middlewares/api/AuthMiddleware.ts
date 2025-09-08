import { db } from "config/db";
import { logger } from "config/winston";
import { eq } from "drizzle-orm";
import { User } from "lib/db/models";
import { users } from "lib/db/schemas";
import { decodeAccessToken } from "lib/utils/tokenize";
import { NextRequest, NextResponse } from "next/server";

export function handlingAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
  roles: string[] = []
) {
  return async function (req: NextRequest): Promise<NextResponse> {
    const accessToken = req.cookies.get("accessToken");

    if (!accessToken) {
      logger.error("invalid token");
      return NextResponse.json(
        {
          status: "fail",
          message: "Unauthenticated, please sign in again",
        },
        { status: 401 }
      );
    }

    // decode token
    const decoded = await decodeAccessToken(accessToken?.value);

    // validate user
    const user: User | undefined = await db.query.users.findFirst({
      where: eq(users.id, decoded?.userId || ""),
    });

    if (!user) {
      logger.error("user not found");
      return NextResponse.json(
        {
          status: "fail",
          message: "Unauthenticated, please sign in again",
        },
        { status: 401 }
      );
    }

    // validate authorization based role
    if (roles?.length > 0) {
      if (
        roles.some(
          (role) => role.toLowerCase() === user?.role?.name.toLowerCase()
        )
      ) {
        return NextResponse.json(
          {
            status: "fail",
            message: "Unauthorized to access the resource",
          },
          { status: 403 }
        );
      }
    }

    req.headers.set("user", JSON.stringify(user));

    return await handler(req);
  };
}
