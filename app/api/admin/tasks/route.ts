import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/admin/tasks`, {
            // In a real app, cookies/session would be handled here
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || 'Gagal mengambil data tugas' },
            { status: error.response?.status || 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const response = await axios.post(`${BACKEND_URL}/api/admin/tasks`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || 'Gagal membuat tugas baru' },
            { status: error.response?.status || 500 }
        );
    }
}
