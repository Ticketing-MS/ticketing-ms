import { handlingError } from "lib/middlewares/api/ErrorMiddleware";
import { handlingLogging } from "lib/middlewares/api/LoggingMiddleware";
import { NextResponse } from "next/server";
import { handlingAuth } from "lib/middlewares/api/AuthMiddleware";
import { refreshToken } from "./service";
import { logger } from "config/winston";
import { cookies } from "next/headers";

async function postHandler(req: Request): Promise<NextResponse> {
  const result: Record<string, string> = await refreshToken(req);

  cookies().set("accessToken", result.accessToken, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15, // 15 menit
  });

  const age = 60 * 60 * 24 * 7;

  cookies().set("refreshToken", result.refreshToken, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: age, // 7 hari
  });

  cookies().set("deviceId", result.deviceId, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: age, // 7 hari
  });

  return NextResponse.json({
    status: "success",
    message: "Token refreshed successfully",
  });
}

export const POST = handlingLogging(handlingError(postHandler));
