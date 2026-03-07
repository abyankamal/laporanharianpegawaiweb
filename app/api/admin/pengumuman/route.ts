import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const page = searchParams.get("page") || "1";
        const limit = searchParams.get("limit") || "10";

        const response = await axios.get(`${BACKEND_URL}/api/admin/pengumuman`, {
            params: { search, page, limit },
            headers: {
                Authorization: request.headers.get("Authorization"),
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Error fetching announcements:", error.response?.data || error.message);
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to fetch announcements" },
            { status: error.response?.status || 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const response = await axios.post(`${BACKEND_URL}/api/admin/pengumuman`, body, {
            headers: {
                Authorization: request.headers.get("Authorization"),
                "Content-Type": "application/json",
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error("Error creating announcement:", error.response?.data || error.message);
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to create announcement" },
            { status: error.response?.status || 500 }
        );
    }
}
