import { z } from "zod"
import errorResponse from "../error";

export function validateBody<T>(
    schema: z.ZodSchema<T>,
    body: unknown
): { success: true; data: T } | { success: false; error: Response } {
    const validation = schema.safeParse(body)
    if (validation.error) {
        return {
            success: false,
            error: errorResponse(400, "Validation failed", [validation.error])
        }
    }
    return { success: true, data: validation.data }
}

export function validateSearchParams<T>(
    schema: z.ZodSchema<T>,
    searchParams: URLSearchParams
): { success: true; data: T } | { success: false; error: Response } {
    const params = Object.fromEntries(searchParams.entries())
    const validation = schema.safeParse(params)
    if (validation.error) {
        return {
            success: false,
            error: errorResponse(400, "Validation failed", [validation.error])
        }
    }
    return { success: true, data: validation.data }
}