import axios from "axios";

export interface Announcement {
    id_pengumuman: string;
    judul: string;
    pesan: string;
    audience: string;
    tanggal: string;
}

export interface AnnouncementStatistik {
    aktif: number;
}

export interface AnnouncementListResponse {
    success: boolean;
    message: string;
    data: {
        list: Announcement[];
        statistik: AnnouncementStatistik;
        pagination: {
            total_data: number;
            total_page: number;
            current_page: number;
        };
    };
}

export interface BaseResponse {
    success: boolean;
    message: string;
}

export const getAnnouncements = async (page = 1, limit = 10, search = ""): Promise<AnnouncementListResponse> => {
    const response = await axios.get("/api/admin/pengumuman", {
        params: { page, limit, search },
    });
    return response.data;
};

export const createAnnouncement = async (data: { judul: string; pesan: string; audience: string }): Promise<BaseResponse> => {
    const response = await axios.post("/api/admin/pengumuman", data);
    return response.data;
};

export const updateAnnouncement = async (id: number, data: { judul: string; pesan: string; audience: string }): Promise<BaseResponse> => {
    const response = await axios.put(`/api/admin/pengumuman/${id}`, data);
    return response.data;
};

export const deleteAnnouncement = async (id: number): Promise<BaseResponse> => {
    const response = await axios.delete(`/api/admin/pengumuman/${id}`);
    return response.data;
};
