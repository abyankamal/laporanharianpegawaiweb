import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { searchParams } = new URL(req.url)

        const queryParams = new URLSearchParams()

        // Forward filters to backend
        const params = ["start_date", "end_date", "user_id"]
        params.forEach(p => {
            const val = searchParams.get(p)
            if (val) queryParams.append(p, val)
        })

        const response = await fetch(`${BACKEND_URL}/api/reports/recap/export/excel?${queryParams.toString()}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            const error = await response.json()
            return NextResponse.json(error, { status: response.status })
        }

        const blob = await response.blob()
        const headers = new Headers()
        headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        headers.set("Content-Disposition", response.headers.get("Content-Disposition") || "attachment; filename=rekap_laporan.xlsx")

        return new NextResponse(blob, { headers })
    } catch (error) {
        console.error("Excel Export API Error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal mengekspor Excel" },
            { status: 500 }
        )
    }
}
