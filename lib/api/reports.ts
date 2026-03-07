export interface BackendReport {
    id: number
    user_id: number
    judul_kegiatan: string
    deskripsi_hasil: string
    waktu_pelaporan: string
    is_overtime: boolean
    status_waktu: string
    status: string
    jam_lapor: string
    foto_url: string | null
    created_at: string
    user?: {
        nama: string
        nip: string
        jabatan?: {
            nama_jabatan: string
        }
    }
}

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
        const result = await response.json()

        // Robust data extraction
        let rawData = []
        if (Array.isArray(result.data)) {
            rawData = result.data
        } else if (result.data && Array.isArray(result.data.list)) {
            rawData = result.data.list
        } else if (Array.isArray(result)) {
            rawData = result
        }

        const mappedData: Report[] = rawData.map((item: any) => {
            // Get date/time
            const rawWaktu = item.waktu_pelaporan || item.WaktuPelaporan || item.created_at || item.CreatedAt
            const dateObj = rawWaktu ? new Date(rawWaktu) : new Date()

            // Get user info
            const user = item.user || item.User
            const jabatan = user?.jabatan || user?.Jabatan

            return {
                id: item.id || item.ID,
                tanggal: dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                nama: user?.nama || user?.Nama || "N/A",
                jabatan: jabatan?.nama_jabatan || jabatan?.NamaJabatan || "N/A",
                laporan: item.judul_kegiatan || item.JudulKegiatan || item.laporan || item.Laporan || "Tidak ada rincian",
                jam_lapor: item.jam_lapor || item.JamLapor || dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                status_waktu: item.status_waktu || item.StatusWaktu || (item.is_overtime ? "Lembur" : "Tepat Waktu"),
                status_review: (item.status === "sudah_direview" || item.Status === "sudah_direview" || item.status === "Disetujui") ? "Disetujui" : "Menunggu",
                nip: user?.nip || user?.NIP || "N/A",
                foto_path: item.foto_url || item.FotoURL || item.foto_path || item.FotoPath,
                deskripsi: item.deskripsi_hasil || item.DeskripsiHasil || item.deskripsi || item.Deskripsi
            }
        })

        return {
            success: result.success ?? true,
            message: result.message || "Success",
            data: mappedData,
            pagination: result.pagination || (result.data && result.data.pagination) || {
                current_page: result.current_page || 1,
                total_pages: result.total_page || 1,
                total_data: result.total_data || mappedData.length,
                limit: params.limit || 10
            }
        }
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

export const downloadReportsPDF = async (params: { start_date?: string, end_date?: string, user_id?: number }) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString())
    })
    window.location.href = `/api/admin/rekap-laporan/export/pdf?${queryParams.toString()}`
}

export const downloadReportsExcel = async (params: { start_date?: string, end_date?: string, user_id?: number }) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString())
    })
    window.location.href = `/api/admin/rekap-laporan/export/excel?${queryParams.toString()}`
}
