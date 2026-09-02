import { NextRequest, NextResponse } from "next/server"
import { BACKEND_URL } from "@/lib/api-config"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const { searchParams } = new URL(req.url)
        const bulan = searchParams.get("bulan") || ""
        const tahun = searchParams.get("tahun") || ""

        const queryParams = new URLSearchParams()
        if (bulan) queryParams.append("bulan", bulan)
        if (tahun) queryParams.append("tahun", tahun)

        const response = await fetch(`${BACKEND_URL}/api/web/absensi/export/pdf?${queryParams.toString()}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            const errorText = await response.text()
            return new NextResponse(errorText, { status: response.status })
        }

        const pdfBlob = await response.arrayBuffer()
        const contentDisposition = response.headers.get("content-disposition") || `attachment; filename="rekap_absensi_${bulan}_${tahun}.pdf"`

        return new NextResponse(pdfBlob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": contentDisposition,
            },
        })
    } catch (error) {
        console.error("Error exporting absensi PDF:", error)
        return NextResponse.json(
            { success: false, status: "error", message: "Gagal mengekspor PDF absensi" },
            { status: 500 }
        )
    }
}
