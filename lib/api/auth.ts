export interface LoginResponse {
    status: string
    message: string
    token?: string
}

export async function login(nip: string, password: string): Promise<LoginResponse> {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nip, password }),
    })
    return res.json()
}

export async function logout(): Promise<{ status: string; message: string }> {
    const res = await fetch("/api/auth/logout", {
        method: "POST",
    })
    return res.json()
}
