import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { searchParams } = new URL(req.url)

        const queryParams = new URLSearchParams()

        // Forward all relevant query params
        const params = [
            "start_date", "end_date", "status_waktu",
            "status_review", "search", "page", "limit"
        ]

        params.forEach(p => {
            const val = searchParams.get(p)
            if (val) queryParams.append(p, val)
        })

        const response = await fetch(`${BACKEND_URL}/api/web/reports/recap?${queryParams.toString()}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: 'no-store'
        })

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Rekap Laporan API Error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal mengambil rekap laporan" },
            { status: 500 }
        )
    }
}
