import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const formData = await req.formData()

        const response = await fetch(`${BACKEND_URL}/api/web/reports`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        })

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Create Report API Error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal membuat laporan" },
            { status: 500 }
        )
    }
}
