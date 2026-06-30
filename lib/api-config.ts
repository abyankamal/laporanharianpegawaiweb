export const BACKEND_URL = process.env.NODE_ENV === "production"
    ? "https://api.siopik.biz.id"
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export const UPLOADS_URL = process.env.NODE_ENV === "production"
    ? "https://api.siopik.biz.id/uploads"
    : "http://localhost:5000/uploads";
