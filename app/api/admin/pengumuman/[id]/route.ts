import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const response = await axios.put(`${BACKEND_URL}/api/admin/pengumuman/${id}`, body, {
            headers: {
                Authorization: request.headers.get("Authorization"),
                "Content-Type": "application/json",
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error(`Error updating announcement ${params.id}:`, error.response?.data || error.message);
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to update announcement" },
            { status: error.response?.status || 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const response = await axios.delete(`${BACKEND_URL}/api/admin/pengumuman/${id}`, {
            headers: {
                Authorization: request.headers.get("Authorization"),
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error(`Error deleting announcement ${params.id}:`, error.response?.data || error.message);
        return NextResponse.json(
            { success: false, message: error.response?.data?.message || "Failed to delete announcement" },
            { status: error.response?.status || 500 }
        );
    }
}
