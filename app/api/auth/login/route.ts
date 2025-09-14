import { validateAPI } from "lib/utils/validation";
import { postSchema } from "./validation";
import { NextResponse } from "next/server";
import { LoginPayload } from "./dto";
import { login } from "./service";
import { handlingError } from "lib/middlewares/api/ErrorMiddleware";
import { handlingLogging } from "lib/middlewares/api/LoggingMiddleware";
import { cookies } from "next/headers";

async function postHandler(req: Request): Promise<NextResponse> {
  const payload = await req.json();
  const validated: LoginPayload = validateAPI(postSchema, payload);

  const result = await login(req, validated);

  if (result.auth) {
    cookies().set("accessToken", result.auth.accessToken, {
      httpOnly: false,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15, // 15 menit
    });

    cookies().set("refreshToken", result.auth.refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    cookies().set("deviceId", result.auth.deviceId, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 tahun
    });

    delete result.auth;
  }

  return NextResponse.json({
    status: "success",
    message: "Login successfully",
    data: result,
  });
}

export const POST = handlingLogging(handlingError(postHandler));
