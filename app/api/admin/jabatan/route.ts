import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value

        const response = await fetch(`${BACKEND_URL}/api/web/admin/jabatan`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: 'no-store'
        })

        const result = await response.json()
        return NextResponse.json(result, { status: response.status })
    } catch (error) {
        console.error("Jabatan API Error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal memproses permintaan" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const body = await req.json()

        const response = await fetch(`${BACKEND_URL}/api/web/admin/jabatan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        })

        const result = await response.json()
        return NextResponse.json(result, { status: response.status })
    } catch (error) {
        console.error("Jabatan POST API Error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal membuat jabatan" },
            { status: 500 }
        )
    }
}
