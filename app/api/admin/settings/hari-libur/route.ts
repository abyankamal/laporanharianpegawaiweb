import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/admin/settings/hari-libur`, {
            cache: 'no-store'
        })
        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Gagal menghubungi server backend" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const response = await fetch(`${BACKEND_URL}/api/admin/settings/hari-libur`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Gagal menghubungi server backend" },
            { status: 500 }
        )
    }
}
