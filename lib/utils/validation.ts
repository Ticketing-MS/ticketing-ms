import { APIValidationError } from "lib/errors/api/APIValidationError";
import Joi from "joi";
import { NextResponse } from "next/server";

export function validateAPI<T>(schema: Joi.Schema<T>, payload: Request): T {
  const { error, value } = schema.validate(payload, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    const errors: Record<string, string> = {};

    for (const d of error.details) {
      const key = d.context?.label ?? "unknown";
      errors[key] = d.message;
    }
    throw new APIValidationError(errors);
  }

  return value as T;
}
