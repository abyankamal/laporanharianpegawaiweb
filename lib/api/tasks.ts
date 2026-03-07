import axios from "axios";
import { Employee } from "./employees";

export interface Task {
    id: number;
    judul_tugas: string;
    deskripsi: string;
    file_bukti: string | null;
    deadline: string | null;
    date?: string;
    created_at?: string;
    created_by: number;
    creator_name?: string;
    creator_nip?: string;
    creator_avatar?: string;
    assignees: Employee[];
}

export interface TaskListResponse {
    success: boolean;
    message: string;
    data: Task[];
}

export interface TaskDetailResponse {
    success: boolean;
    message: string;
    data: Task;
}

export interface BaseResponse {
    success: boolean;
    message: string;
}

export const getTasks = async () => {
    const response = await axios.get<TaskListResponse>('/api/admin/tasks');
    return response.data;
};

export const createTask = async (formData: FormData) => {
    const response = await axios.post<TaskDetailResponse>('/api/admin/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateTask = async (id: number, formData: FormData) => {
    const response = await axios.put<TaskDetailResponse>(`/api/admin/tasks/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteTask = async (id: number) => {
    const response = await axios.delete<BaseResponse>(`/api/admin/tasks/${id}`);
    return response.data;
};
