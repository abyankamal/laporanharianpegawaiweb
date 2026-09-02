import axios from "axios";

export interface PengajuanIzin {
    id: number;
    user_id: number;
    user?: {
        id: number;
        nama: string;
        nip: string;
        role: string;
    };
    jenis_izin: string; // 'sakit', 'cuti', 'izin', 'dinas_luar'
    tanggal_mulai: string;
    tanggal_selesai: string;
    keterangan: string;
    dokumen_path?: string | null;
    status_approval: string; // 'pending', 'disetujui', 'ditolak'
    approved_by?: number | null;
    approved_at?: string | null;
    komentar_approver?: string | null;
    created_at: string;
}

export interface PendingIzinResponse {
    status: string;
    message: string;
    data: PengajuanIzin[];
}

export interface CreateIzinByAdminPayload {
    user_id: number;
    jenis_izin: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    keterangan: string;
    dokumen?: File | null;
}

export const getPendingIzin = async (): Promise<PendingIzinResponse> => {
    const response = await axios.get('/api/web/izin/pending');
    return response.data;
};

export const approveIzin = async (id: number, approved: boolean, komentar?: string) => {
    const response = await axios.put(`/api/web/izin/${id}/approve`, {
        approved,
        komentar: komentar || (approved ? "Disetujui oleh Web Admin" : "Ditolak oleh Web Admin")
    });
    return response.data;
};

export const createIzinByAdmin = async (payload: CreateIzinByAdminPayload) => {
    const formData = new FormData();
    formData.append("user_id", payload.user_id.toString());
    formData.append("jenis_izin", payload.jenis_izin);
    formData.append("tanggal_mulai", payload.tanggal_mulai);
    formData.append("tanggal_selesai", payload.tanggal_selesai);
    formData.append("keterangan", payload.keterangan);
    if (payload.dokumen) {
        formData.append("dokumen", payload.dokumen);
    }

    const response = await axios.post('/api/web/izin', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};
