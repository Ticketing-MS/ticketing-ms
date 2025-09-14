import { NextRequest, NextResponse } from "next/server";
import { logger } from "../../../config/winston";
import "dotenv/config";
import { File } from "buffer";

function masking(data: Record<string, any>): string {
  const maskingProps: string[] = process.env
    .MASKING_PROPS!.toString()
    .split(",");

  // looping each key value
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      data[key] = "[...]";
    } else if (value instanceof File) {
      data[key] = "File {...}";
    } else if (typeof value === "object") {
      data[key] = "{...}";
    } else if (maskingProps.some((prop) => prop === key)) {
      data[key] = "******";
    }
  }

  return JSON.stringify(data);
}

export function handlingLogging(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async function (req: NextRequest): Promise<NextResponse> {
    req.headers.get("x-request-id");

    // clone request & response, then pass original request
    const cloneRequest = req.clone();
    const response = await handler(req);
    const cloneResponse = response.clone();

    let requestData: Record<string, any> = {};

    if (
      cloneRequest.body &&
      req.headers.get("Content-Type")?.includes("application/json")
    ) {
      const rawRequest = await cloneRequest.text();
      requestData = JSON.parse(rawRequest);
    } else if (
      cloneRequest.body &&
      req.headers.get("Content-Type")?.includes("multipart/form-data;")
    ) {
      const rawRequest = await cloneRequest.formData();
      for (const [key, value] of rawRequest.entries()) {
        requestData[key] = value;
      }
    }

    const responseJson = await cloneResponse.json();

    logger.info({
      message: "Request received",
      method: req.method,
      path: req.nextUrl.pathname,
      requestId: req.headers.get("x-request-id"),
      body: masking(requestData),
      params: req.nextUrl.searchParams,
    });

    logger.info({
      message: "Response sent",
      request: {
        method: req.method,
        path: req.nextUrl.pathname,
        requestId: req.headers.get("x-request-id"),
      },
      status: cloneResponse.status,
      data:
        cloneResponse.body && responseJson.data
          ? masking(responseJson.data)
          : {},
    });

    return response;
  };
}
