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
    alamat_lokasi: string
    deskripsi_hasil: string
    is_overtime: boolean
    status: string
    foto_url: string | null
    dokumen_url: string | null
    user: User
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
    const response = await axios.get('/api/admin/dashboard/summary')
    const data = response.data
    return {
        ...data,
        success: data.success || data.status === "success"
    }
}
