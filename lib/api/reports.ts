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
    dokumen_path?: string
    deskripsi?: string
    // Full detail fields
    jenis_tugas?: string
    waktu_pelaksanaan?: string
    lokasi?: string
    komentar_atasan?: string | null
    owner_role?: string
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
                dokumen_path: item.dokumen_url || item.DokumenURL || item.dokumen_path || item.DokumenPath,
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

export const getReportDetail = async (id: number) => {
    try {
        const response = await fetch(`/api/admin/reports/${id}`)
        const result = await response.json()

        if (!result.success) {
            throw new Error(result.message || "Gagal mengambil detail laporan")
        }

        const item = result.data
        const dateObj = new Date(item.waktu_pelaksanaan || item.waktu_pelaporan)

        const mappedReport: Report = {
            id: item.id,
            tanggal: dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            nama: item.user?.nama || "N/A",
            jabatan: item.user?.jabatan?.nama_jabatan || "N/A",
            laporan: item.judul_laporan || item.judul_kegiatan || "Tidak ada judul",
            jam_lapor: dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            status_waktu: item.status_waktu || (item.is_overtime ? "Lembur" : "Tepat Waktu"),
            status_review: item.status === "sudah_direview" ? "Disetujui" : "Menunggu",
            nip: item.user?.nip || "N/A",
            foto_path: item.foto_url,
            dokumen_path: item.dokumen_url,
            deskripsi: item.deskripsi_hasil,
            jenis_tugas: item.jenis_tugas,
            waktu_pelaksanaan: item.waktu_pelaksanaan,
            lokasi: item.lokasi,
            komentar_atasan: item.komentar_atasan,
            owner_role: item.owner_role
        }

        return mappedReport
    } catch (error) {
        console.error("Error in getReportDetail:", error)
        throw error
    }
}

export const evaluateReport = async (reportId: number, status: string, comment: string) => {
    try {
        const response = await fetch('/api/admin/reports/evaluate', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                report_id: reportId,
                status: status,
                komentar: comment
            })
        })
        return await response.json()
    } catch (error) {
        console.error("Error in evaluateReport:", error)
        return { success: false, message: "Gagal menghubungkan ke server untuk evaluasi" }
    }
}

export const downloadAttachments = async (params: { start_date?: string, end_date?: string, user_id?: number }) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString())
    })
    window.location.href = `/api/admin/reports/export/attachments?${queryParams.toString()}`
}
