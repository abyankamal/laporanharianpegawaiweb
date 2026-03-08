import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function PUT(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const body = await req.json()
        const response = await fetch(`${BACKEND_URL}/api/web/reports/evaluate`, {
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
        console.error("Evaluate Report API Error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal mengevaluasi laporan" },
            { status: 500 }
        )
    }
}
