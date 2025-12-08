import { NextResponse } from "next/server"

export type APIError =  {
    code: number,
    error: string,
    causes: any[]
}

export default function errorResponse(code: number, message: string, causes: any[] = []): NextResponse<APIError> {
    return NextResponse.json(
        { 
            code: code, 
            error: message, 
            causes: causes
        }, 
        { status: code }
    )
}