import axios from "axios";
import { Employee } from "./employees";

export interface RefSkorPenilaian {
    id: number;
    keterangan: string;
    bobot_nilai: number;
}

export const SKOR_PENILAIAN_LIST: RefSkorPenilaian[] = [
    { id: 1, keterangan: "Dibawah Ekspektasi", bobot_nilai: 1 },
    { id: 2, keterangan: "Sesuai Ekspektasi", bobot_nilai: 2 },
    { id: 3, keterangan: "Diatas Ekspektasi", bobot_nilai: 3 },
];

export interface PenilaianItem {
    id: number;
    user_id: number;
    penilai_id: number;
    skor_id: number;
    jenis_periode: string;
    bulan: number;
    tahun: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    catatan?: string;
    created_at: string;
    user?: Employee;
    skor?: RefSkorPenilaian;
}

export interface CreateReviewPayload {
    target_user_id: number;
    skor_id: number;
    jenis_periode: string; // 'Bulanan'
    bulan: number;
    tahun: number;
    tanggal_mulai: string;
    tanggal_selesai: string;
    catatan?: string;
}

export interface BaseReviewResponse {
    success: boolean;
    status?: string;
    message: string;
    data?: any;
}

export const getMySubmittedReviews = async (): Promise<{ success: boolean; data: PenilaianItem[]; message?: string }> => {
    const response = await axios.get('/api/admin/reviews/submissions');
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success",
        data: result.data || []
    };
};

export const createReview = async (payload: CreateReviewPayload): Promise<BaseReviewResponse> => {
    const response = await axios.post('/api/admin/reviews', payload);
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success"
    };
};
