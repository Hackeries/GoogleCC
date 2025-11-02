import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";
import { asyncHandler } from "./asyncHandler.middeware";

type ValidationSource = "body" | "params" | "query";

/**
 * Combines async error handling with request validation.
 * @param DtoClass - DTO class (using class-validator)
 * @param source - Request data source (body | params | query)
 * @param handler - Controller logic
 */
export function asyncHandlerAndValidation<T extends object>(
  DtoClass: new () => T,
  source: ValidationSource = "body",
  handler: (req: Request, res: Response, dto: T) => Promise<any>
) {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Convert incoming request data into DTO instance
        const dtoInstance = plainToInstance(DtoClass, req[source]);
        const errors = await validate(dtoInstance, { whitelist: true });

        // If validation errors exist, respond with formatted error
        if (errors.length > 0) {
          return formatValidationError(res, errors);
        }

        // Proceed with controller logic
        await handler(req, res, dtoInstance);
      } catch (error) {
        next(error);
      }
    }
  );
}

/**
 * Format validation errors consistently.
 */
function formatValidationError(res: Response, errors: ValidationError[]) {
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    errors: errors.map((err) => ({
      field: err.property,
      message: Object.values(err.constraints || {}),
    })),
  });
}
