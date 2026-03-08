import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { id } = await params
        const body = await req.json()

        const response = await fetch(`${BACKEND_URL}/api/web/admin/jabatan/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        })

        const result = await response.json()
        return NextResponse.json(result, { status: response.status })
    } catch (error) {
        console.error("Jabatan PUT API Error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal memperbarui jabatan" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { id } = await params

        const response = await fetch(`${BACKEND_URL}/api/web/admin/jabatan/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })

        const result = await response.json()
        return NextResponse.json(result, { status: response.status })
    } catch (error) {
        console.error("Jabatan DELETE API Error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal menghapus jabatan" },
            { status: 500 }
        )
    }
}
