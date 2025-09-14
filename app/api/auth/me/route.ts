import { handlingError } from "lib/middlewares/api/ErrorMiddleware";
import { handlingLogging } from "lib/middlewares/api/LoggingMiddleware";
import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "./service";
import { handlingAuth } from "lib/middlewares/api/AuthMiddleware";
import { validateAPI } from "lib/utils/validation";
import { putSchema } from "./validation";
import { UpdateProfilePayload } from "./dto";
import { LoginResponse } from "../login/dto";

async function getHandler(req: Request): Promise<NextResponse> {
  const result: LoginResponse = await getProfile(req);

  delete result.auth;

  return NextResponse.json({
    status: "success",
    message: "Data fetched successfully",
    data: result,
  });
}

async function putHandler(req: Request): Promise<NextResponse> {
  const payload = await req.formData();
  const payloadObj: any = {};
  payload.forEach((value, key) => {
    payloadObj[key] = payload.get(key);
  });

  // validate payload
  const validated: UpdateProfilePayload = validateAPI(putSchema, payloadObj);
  await updateProfile(req, validated);

  return NextResponse.json({
    status: "success",
    message: "Data updated successfully",
  });
}

export const GET = handlingLogging(handlingError(handlingAuth(getHandler)));
export const PUT = handlingLogging(handlingError(handlingAuth(putHandler)));
