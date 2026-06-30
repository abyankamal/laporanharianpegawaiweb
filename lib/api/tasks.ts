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

export const getTasks = async (): Promise<TaskListResponse> => {
    const response = await axios.get('/api/admin/tasks');
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success"
    };
};

export const createTask = async (formData: FormData): Promise<TaskDetailResponse> => {
    const response = await axios.post('/api/admin/tasks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success"
    };
};

export const updateTask = async (id: number, formData: FormData): Promise<TaskDetailResponse> => {
    const response = await axios.put(`/api/admin/tasks/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success"
    };
};

export const deleteTask = async (id: number): Promise<BaseResponse> => {
    const response = await axios.delete(`/api/admin/tasks/${id}`);
    const result = response.data;
    return {
        ...result,
        success: result.success || result.status === "success"
    };
};
