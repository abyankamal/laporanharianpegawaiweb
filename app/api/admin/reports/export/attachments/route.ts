import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { searchParams } = new URL(req.url)

        const response = await fetch(`${BACKEND_URL}/api/web/reports/export/attachments?${searchParams.toString()}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`)
        }

        // Get the binary data
        const blob = await response.blob()
        const headers = new Headers()
        headers.set("Content-Type", response.headers.get("Content-Type") || "application/zip")
        headers.set("Content-Disposition", response.headers.get("Content-Disposition") || 'attachment; filename="attachments.zip"')

        return new NextResponse(blob, { headers })
    } catch (error) {
        console.error("Export Attachments API Error:", error)
        return NextResponse.json(
            { success: false, message: "Gagal mendownload lampiran" },
            { status: 500 }
        )
    }
}
