import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const id = params.id
        const body = await req.formData()
        const response = await fetch(`${BACKEND_URL}/api/web/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: body,
        })

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Gagal menghubungi server backend" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = req.cookies.get("admin_token")?.value
        const id = params.id
        const response = await fetch(`${BACKEND_URL}/api/web/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { status: "error", message: "Gagal menghubungi server backend" },
            { status: 500 }
        )
    }
}
