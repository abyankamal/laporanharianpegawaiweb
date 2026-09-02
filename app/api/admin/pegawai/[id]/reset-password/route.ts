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
        const response = await fetch(`${BACKEND_URL}/api/web/admin/pegawai/${id}/reset-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Gagal mereset password pegawai" },
            { status: 500 }
        )
    }
}
