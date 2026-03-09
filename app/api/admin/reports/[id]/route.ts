import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { id } = await params

        const response = await fetch(`${BACKEND_URL}/api/web/reports/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Detail Laporan API error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal menghubungkan ke server backend" },
            { status: 500 }
        )
    }
}
