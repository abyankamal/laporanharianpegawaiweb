import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id
        const response = await fetch(`${BACKEND_URL}/api/admin/settings/hari-libur/${id}`, {
            method: "DELETE",
        })

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Gagal menghubungi server backend" },
            { status: 500 }
        )
    }
}
