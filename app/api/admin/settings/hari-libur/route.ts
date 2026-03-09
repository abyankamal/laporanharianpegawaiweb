import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const response = await fetch(`${BACKEND_URL}/api/web/admin/hari-libur`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: 'no-store'
        })
        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Gagal mengambil data hari libur" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const body = await req.json()
        const response = await fetch(`${BACKEND_URL}/api/web/admin/hari-libur`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Gagal membuat hari libur" },
            { status: 500 }
        )
    }
}
