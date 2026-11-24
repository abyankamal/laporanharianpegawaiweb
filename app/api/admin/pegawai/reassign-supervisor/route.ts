import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

async function handleReassign(req: NextRequest, method: "POST" | "PUT" | "PATCH") {
    try {
        const token = req.cookies.get("admin_token")?.value
        const body = await req.json()
        const response = await fetch(`${BACKEND_URL}/api/web/users/reassign-supervisor`, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })
        const data = await response.json()
        if (data && data.status && typeof data.success === "undefined") {
            data.success = data.status === "success"
        }
        return NextResponse.json(data, { status: response.status })
    } catch {
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal memindahkan supervisor bawahan" },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    return handleReassign(req, "POST")
}

export async function PUT(req: NextRequest) {
    return handleReassign(req, "PUT")
}

export async function PATCH(req: NextRequest) {
    return handleReassign(req, "PATCH")
}
