import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const response = await fetch(`${BACKEND_URL}/api/web/admin/supervisor-lurah`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: 'no-store'
        })
        const data = await response.json()

        if (data && data.status) {
            data.success = data.status === "success"
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Error fetching supervisor lurah:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal mengambil data supervisor lurah" },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const body = await req.json().catch(() => ({}))

        const response = await fetch(`${BACKEND_URL}/api/web/admin/supervisor-lurah`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        const data = await response.json()

        if (data && data.status) {
            data.success = data.status === "success"
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Error updating supervisor lurah:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal memperbarui data supervisor lurah" },
            { status: 500 }
        )
    }
}
