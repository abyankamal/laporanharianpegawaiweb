import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const response = await fetch(`${BACKEND_URL}/api/admin/dashboard/summary`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: 'no-store'
        })
        const data = await response.json()

        if (data && data.status) {
            data.success = data.status === "success"
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal mengambil ringkasan dashboard" },
            { status: 500 }
        )
    }
}
