import axios from "axios";

export interface Jabatan {
    id: number;
    nama: string;
}

export interface KategoriPegawai {
    id: number;
    nama_kategori: string;
    kode_kategori: string;
}

export const KATEGORI_PEGAWAI_LIST: KategoriPegawai[] = [
    { id: 1, nama_kategori: "PNS", kode_kategori: "pns" },
    { id: 2, nama_kategori: "PPPK Penuh Waktu", kode_kategori: "p3k_penuh" },
    { id: 3, nama_kategori: "PPPK Paruh Waktu", kode_kategori: "p3k_paruh" },
];

export interface Employee {
    id: number;
    nip: string;
    nama: string;
    role: string;
    jabatan_id: number | null;
    supervisor_id: number | null;
    kategori_pegawai_id?: number | null;
    foto_path: string | null;
    jabatan?: {
        id: number;
        nama_jabatan: string;
    };
    kategori_pegawai?: KategoriPegawai;
    password?: string;
}

export interface EmployeeListResponse {
    success: boolean;
    message: string;
    data: {
        list: Employee[];
        statistik: {
            total_pegawai: number;
        };
        pagination: {
            total_data: number;
            total_pages: number;
            current_page: number;
        };
    };
}

export interface JabatanListResponse {
    success: boolean;
    message: string;
    data: Jabatan[];
}

export interface BaseResponse {
    success: boolean;
    message: string;
}

export const getEmployees = async (params?: { search?: string; role?: string; page?: number; limit?: number }): Promise<EmployeeListResponse> => {
    const response = await axios.get('/api/admin/pegawai', { params });
    const data = response.data;
    return {
        ...data,
        success: data.success || data.status === "success"
    };
};

export const getJabatans = async () => {
    const response = await axios.get<JabatanListResponse>('/api/jabatan');
    return response.data;
};

export const createEmployee = async (data: Partial<Employee>): Promise<BaseResponse> => {
    const response = await axios.post('/api/admin/pegawai', data);
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success"
    };
};

export const updateEmployee = async (id: number, data: Partial<Employee>): Promise<BaseResponse> => {
    const response = await axios.put(`/api/admin/pegawai/${id}`, data);
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success"
    };
};

export const deleteEmployee = async (id: number): Promise<BaseResponse> => {
    const response = await axios.delete(`/api/admin/pegawai/${id}`);
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success"
    };
};

export const resetEmployeePassword = async (id: number, newPassword?: string): Promise<BaseResponse> => {
    const response = await axios.put(`/api/admin/pegawai/${id}/reset-password`, {
        new_password: newPassword,
    });
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success"
    };
};
