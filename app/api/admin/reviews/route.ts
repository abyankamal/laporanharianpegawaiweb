import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const body = await req.json().catch(() => ({}))

        const response = await fetch(`${BACKEND_URL}/api/web/reviews`, {
            method: "POST",
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
        console.error("Error creating review:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal menyimpan penilaian kinerja" },
            { status: 500 }
        )
    }
}
