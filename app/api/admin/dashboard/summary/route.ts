import { NextResponse } from 'next/server';
import axios from 'axios';

// Backend Go URL (you should ideally put this in .env.local as NEXT_PUBLIC_API_URL or similar)
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET() {
    try {
        // Here you would optimally extract the user's session token 
        // from cookies/headers to forward to the backend if needed:
        // const token = _request.headers.get('Authorization') || '';

        const response = await axios.get(`${BACKEND_URL}/api/admin/dashboard/summary`, {
            // headers: {
            //     'Authorization': token
            // }
        });

        // Forward the exact JSON response from the Go Backend
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Dashboard Proxy Error:", error.message);

            // Forward error status and message if it came from the backend
            if (error.response) {
                return NextResponse.json(
                    error.response.data,
                    { status: error.response.status }
                );
            }
        }

        // Handle generic internal server errors
        const errMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { success: false, message: "Internal server error proxying dashboard data", error: errMessage },
            { status: 500 }
        );
    }
}
