import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { searchParams } = new URL(req.url)
        const role = searchParams.get("role") || ""

        const query = role ? `?role=${encodeURIComponent(role)}` : ""
        const response = await fetch(`${BACKEND_URL}/api/web/users/supervisors${query}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
        })
        const data = await response.json()
        if (data && data.status && typeof data.success === "undefined") {
            data.success = data.status === "success"
        }
        return NextResponse.json(data, { status: response.status })
    } catch {
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal mengambil daftar atasan" },
            { status: 500 }
        )
    }
}
