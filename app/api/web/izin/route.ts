import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const formData = await req.formData()

        const response = await fetch(`${BACKEND_URL}/api/web/izin`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        })
        const data = await response.json()

        if (data && data.status) {
            data.success = data.status === "success"
        }

        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        console.error("Error creating leave by admin:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal membuat permohonan izin" },
            { status: 500 }
        )
    }
}
