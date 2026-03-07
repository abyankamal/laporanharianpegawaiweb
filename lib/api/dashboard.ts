import axios from "axios"

export interface Statistik {
    total_pegawai: number
    laporan_masuk: number
    tepat_waktu: number
    lembur: number
}

export interface User {
    id: number
    nama: string
    nip: string
    jabatan_id: number
}

export interface Laporan {
    id: number
    user_id: number
    waktu_pelaporan: string
    lokasi: string
    keterangan: string
    status_waktu: string
    status: string
    lampiran: string
    User: User
}

export interface Notification {
    id: number
    kategori: string
    judul: string
    pesan: string
    created_at: string
}

export interface TugasOrganisasi {
    id: number
    judul: string
    deskripsi: string
    deadline: string
}

export interface DashboardData {
    statistik: Statistik
    laporan_terbaru: Laporan[]
    notifikasi: Notification | null
    agenda: TugasOrganisasi[]
}

export interface DashboardResponse {
    success: boolean
    message?: string
    data: DashboardData
}

// Call the internal Next.js API Route, which acts as a proxy to the backend
export const getDashboardSummary = async (): Promise<DashboardResponse> => {
    const response = await axios.get<DashboardResponse>('/api/admin/dashboard/summary', {
        // Auth headers can be handled within the proxy or using Next.js cookies
    })
    return response.data
}
