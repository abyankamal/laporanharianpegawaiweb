import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const response = await axios.put(`${BACKEND_URL}/api/admin/pegawai/${params.id}`, body);
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Pegawai Proxy PUT Error:", error.message);
            if (error.response) {
                return NextResponse.json(error.response.data, { status: error.response.status });
            }
        }
        return NextResponse.json(
            { success: false, message: "Internal server error updating pegawai" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const response = await axios.delete(`${BACKEND_URL}/api/admin/pegawai/${params.id}`);
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Pegawai Proxy DELETE Error:", error.message);
            if (error.response) {
                return NextResponse.json(error.response.data, { status: error.response.status });
            }
        }
        return NextResponse.json(
            { success: false, message: "Internal server error deleting pegawai" },
            { status: 500 }
        );
    }
}
