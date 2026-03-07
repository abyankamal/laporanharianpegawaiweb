import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const formData = await request.formData();
        const response = await axios.put(`${BACKEND_URL}/api/admin/tasks/${params.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || 'Gagal memperbarui tugas' },
            { status: error.response?.status || 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await axios.delete(`${BACKEND_URL}/api/admin/tasks/${params.id}`);
        return NextResponse.json(response.data);
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || 'Gagal menghapus tugas' },
            { status: error.response?.status || 500 }
        );
    }
}
