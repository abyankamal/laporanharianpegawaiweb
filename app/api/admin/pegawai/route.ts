import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';

        const response = await axios.get(`${BACKEND_URL}/api/admin/pegawai`, {
            params: { search, page, limit }
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Pegawai Proxy GET Error:", error.message);
            if (error.response) {
                return NextResponse.json(error.response.data, { status: error.response.status });
            }
        }
        return NextResponse.json(
            { success: false, message: "Internal server error proxying pegawai data" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await axios.post(`${BACKEND_URL}/api/admin/pegawai`, body);
        return NextResponse.json(response.data, { status: 201 });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Pegawai Proxy POST Error:", error.message);
            if (error.response) {
                return NextResponse.json(error.response.data, { status: error.response.status });
            }
        }
        return NextResponse.json(
            { success: false, message: "Internal server error creating pegawai" },
            { status: 500 }
        );
    }
}
