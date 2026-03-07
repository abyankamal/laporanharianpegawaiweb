import axios from "axios";

export interface Jabatan {
    id: number;
    nama: string;
}

export interface Employee {
    id: number;
    nip: string;
    nama: string;
    role: string;
    jabatan_id: number | null;
    supervisor_id: number | null;
    foto_path: string | null;
    jabatan?: {
        id: number;
        nama_jabatan: string;
    };
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

export const getEmployees = async (params?: { search?: string; role?: string; page?: number; limit?: number }) => {
    const response = await axios.get<EmployeeListResponse>('/api/admin/pegawai', { params });
    return response.data;
};

export const getJabatans = async () => {
    const response = await axios.get<JabatanListResponse>('/api/jabatan');
    return response.data;
};

export const createEmployee = async (data: Partial<Employee>) => {
    const response = await axios.post<BaseResponse>('/api/admin/pegawai', data);
    return response.data;
};

export const updateEmployee = async (id: number, data: Partial<Employee>) => {
    const response = await axios.put<BaseResponse>(`/api/admin/pegawai/${id}`, data);
    return response.data;
};

export const deleteEmployee = async (id: number) => {
    const response = await axios.delete<BaseResponse>(`/api/admin/pegawai/${id}`);
    return response.data;
};
