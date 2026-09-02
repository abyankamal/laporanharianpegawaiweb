import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { id } = await params
        const body = await req.json().catch(() => ({}))

        const response = await fetch(`${BACKEND_URL}/api/web/izin/${id}/approve`, {
            method: "PUT",
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
        console.error("Error approving leave request:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal memproses persetujuan izin" },
            { status: 500 }
        )
    }
}
