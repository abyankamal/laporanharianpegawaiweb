import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const response = await fetch(`${BACKEND_URL}/api/web/admin/geofencing`, {
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
        console.error("Error fetching geofencing settings:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal mengambil data pengaturan geofencing" },
            { status: 500 }
        )
    }
}

export async function PUT(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const body = await req.json().catch(() => ({}))

        const response = await fetch(`${BACKEND_URL}/api/web/admin/geofencing`, {
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
        console.error("Error updating geofencing settings:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal memperbarui pengaturan geofencing" },
            { status: 500 }
        )
    }
}
