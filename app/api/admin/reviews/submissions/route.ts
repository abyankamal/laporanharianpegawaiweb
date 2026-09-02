import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const response = await fetch(`${BACKEND_URL}/api/web/reviews/submissions`, {
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
        console.error("Error fetching review submissions:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal mengambil daftar riwayat penilaian" },
            { status: 500 }
        )
    }
}
