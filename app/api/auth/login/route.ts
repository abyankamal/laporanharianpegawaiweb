import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const response = await fetch(`${BACKEND_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        if (data.status === "success" && data.token) {
            const nextResponse = NextResponse.json(data)

            // Set HTTP-only cookie for server-side auth (proxy) and security
            nextResponse.cookies.set({
                name: "admin_token",
                value: data.token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            return nextResponse
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Login Error:", error)
        return NextResponse.json(
            { status: "error", message: "Gagal menghubungi server backend" },
            { status: 500 }
        )
    }
}
