export interface Report {
    id: number
    tanggal: string
    nama: string
    jabatan: string
    laporan: string
    jam_lapor: string
    status_waktu: string
    status_review: string
    nip?: string
    foto_path?: string
    deskripsi?: string
}

export interface RekapLaporanResponse {
    success: boolean
    message: string
    data: Report[]
    pagination: {
        current_page: number
        limit: number
        total_data: number
        total_pages: number
    }
}

export const getRekapLaporan = async (params: {
    start_date?: string
    end_date?: string
    status_waktu?: string
    status_review?: string
    search?: string
    page?: number
    limit?: number
}) => {
    try {
        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                queryParams.append(key, value.toString())
            }
        })

        const response = await fetch(`/api/admin/rekap-laporan?${queryParams.toString()}`)
        return await response.json() as RekapLaporanResponse
    } catch (error) {
        console.error("Error in getRekapLaporan:", error)
        return {
            success: false,
            message: "Network error",
            data: [],
            pagination: { current_page: 1, limit: 10, total_data: 0, total_pages: 0 }
        }
    }
}
