import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { searchParams } = new URL(req.url)
        const bulan = searchParams.get("bulan") || ""
        const tahun = searchParams.get("tahun") || ""

        const queryParams = new URLSearchParams()
        if (bulan) queryParams.append("bulan", bulan)
        if (tahun) queryParams.append("tahun", tahun)

        const response = await fetch(`${BACKEND_URL}/api/web/absensi/recap?${queryParams.toString()}`, {
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
        console.error("Error fetching absensi recap:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal mengambil data rekap absensi" },
            { status: 500 }
        )
    }
}
