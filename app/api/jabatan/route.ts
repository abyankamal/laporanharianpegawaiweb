import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET() {
    try {
        const response = await axios.get(`${BACKEND_URL}/api/jabatan`);
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Jabatan Proxy GET Error:", error.message);
            if (error.response) {
                return NextResponse.json(error.response.data, { status: error.response.status });
            }
        }
        return NextResponse.json(
            { success: false, message: "Internal server error proxying jabatan data" },
            { status: 500 }
        );
    }
}
