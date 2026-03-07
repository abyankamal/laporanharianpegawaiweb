export interface Jabatan {
    id: number
    nama: string
}

export interface JabatanResponse {
    success: boolean
    message: string
    data: Jabatan[]
}

export interface SingleJabatanResponse {
    success: boolean
    message: string
    data: Jabatan
}

export const getJabatans = async (): Promise<JabatanResponse> => {
    try {
        const response = await fetch("/api/admin/jabatan")
        const result = await response.json()

        // Backend returns { status: "success", data: [...] }
        return {
            success: result.status === "success" || result.success,
            message: result.message || "",
            data: result.data || []
        }
    } catch (error) {
        console.error("Error in getJabatans:", error)
        return { success: false, message: "Network error", data: [] }
    }
}

export const createJabatan = async (data: { nama: string }): Promise<SingleJabatanResponse> => {
    try {
        const response = await fetch("/api/admin/jabatan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        return {
            success: result.status === "success" || result.success,
            message: result.message || "",
            data: result.data
        }
    } catch (error) {
        console.error("Error in createJabatan:", error)
        return { success: false, message: "Network error", data: {} as Jabatan }
    }
}

export const updateJabatan = async (id: number, data: { nama: string }): Promise<SingleJabatanResponse> => {
    try {
        const response = await fetch(`/api/admin/jabatan/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        return {
            success: result.status === "success" || result.success,
            message: result.message || "",
            data: result.data
        }
    } catch (error) {
        console.error("Error in updateJabatan:", error)
        return { success: false, message: "Network error", data: {} as Jabatan }
    }
}

export const deleteJabatan = async (id: number): Promise<{ success: boolean, message: string }> => {
    try {
        const response = await fetch(`/api/admin/jabatan/${id}`, {
            method: "DELETE"
        })
        const result = await response.json()
        return {
            success: result.status === "success" || result.success,
            message: result.message || ""
        }
    } catch (error) {
        console.error("Error in deleteJabatan:", error)
        return { success: false, message: "Network error" }
    }
}
