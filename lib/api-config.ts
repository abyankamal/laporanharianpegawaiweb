export const BACKEND_URL = process.env.NODE_ENV === "production"
    ? "https://laporanharian.suratkasubag.com"
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export const UPLOADS_URL = process.env.NODE_ENV === "production"
    ? "https://laporanharian.suratkasubag.com/uploads"
    : "http://localhost:5000/uploads";
