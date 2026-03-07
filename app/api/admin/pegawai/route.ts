import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { searchParams } = new URL(req.url)
        const search = searchParams.get("search") || ""
        const role = searchParams.get("role") || ""
        const page = searchParams.get("page") || "1"
        const limit = searchParams.get("limit") || "10"

        const queryParams = new URLSearchParams({ search, role, page, limit }).toString()

        const response = await fetch(`${BACKEND_URL}/api/admin/pegawai?${queryParams}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: 'no-store'
        })
        const data = await response.json()

        // Normalize response for frontend (ensure 'success' boolean exists)
        if (data && data.status) {
            data.success = data.status === "success"
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal mengambil data pegawai" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const body = await req.json()
        const response = await fetch(`${BACKEND_URL}/api/admin/pegawai`, {
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

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal membuat data pegawai" },
            { status: 500 }
        )
    }
}
