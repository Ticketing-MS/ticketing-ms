import { handlingError } from "lib/middlewares/api/ErrorMiddleware";
import { handlingLogging } from "lib/middlewares/api/LoggingMiddleware";
import { NextResponse } from "next/server";
import { getDevices } from "./service";
import { DeviceData } from "./dto";
import { handlingAuth } from "lib/middlewares/api/AuthMiddleware";

async function getHandler(req: Request): Promise<NextResponse> {
  const result: DeviceData[] = await getDevices(req);

  return NextResponse.json({
    status: "success",
    message: "Data fetched successfully",
    data: result,
  });
}

export const GET = handlingLogging(handlingError(handlingAuth(getHandler)));
