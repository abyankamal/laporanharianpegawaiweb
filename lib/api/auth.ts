export interface LoginResponse {
    status: string
    message: string
    token?: string
}

export interface UserProfile {
    id: number;
    nip: string;
    nama: string;
    role: string;
    foto_path: string | null;
    nama_jabatan: string;
}

export const login = async (nip: string, password: string): Promise<LoginResponse> => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nip, password })
    });
    return response.json();
};

export const logout = async (): Promise<void> => {
    await fetch('/api/auth/logout', { method: 'POST' });
};

export const getProfile = async (): Promise<{ status: string; data: UserProfile }> => {
    const response = await fetch('/api/auth/profile');
    return response.json();
};
