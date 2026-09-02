import axios from "axios";

export interface AbsensiRecapItem {
    user_id: number;
    nip: string;
    nama: string;
    jabatan: string;
    kategori_pegawai: string;
    hadir: number;
    sakit: number;
    cuti: number;
    izin: number;
    dinas_luar: number;
    alpa: number;
    total_jam_kerja: number;
}

export interface AbsensiRecapResponse {
    status: string;
    message: string;
    data: {
        bulan: number;
        tahun: number;
        recap: AbsensiRecapItem[];
    };
}

export const getAbsensiRecap = async (bulan?: number, tahun?: number): Promise<AbsensiRecapResponse> => {
    const response = await axios.get('/api/web/absensi/recap', {
        params: { bulan, tahun }
    });
    return response.data;
};

export const exportAbsensiPDF = async (bulan?: number, tahun?: number): Promise<Blob> => {
    const response = await axios.get('/api/web/absensi/export/pdf', {
        params: { bulan, tahun },
        responseType: 'blob'
    });
    return response.data;
};
