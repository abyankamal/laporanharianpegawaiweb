export interface WorkHour {
    id: number
    jam_masuk: string
    jam_pulang: string
    jam_masuk_jumat: string
    jam_pulang_jumat: string
}

export interface Holiday {
    id: number
    tanggal_mulai: string
    tanggal_selesai: string
    keterangan: string
}

export interface BaseResponse<T> {
    status: string
    message: string
    data: T
}

export async function getWorkHour(): Promise<BaseResponse<WorkHour>> {
    const res = await fetch("/api/admin/settings/jam-kerja")
    return res.json()
}

export async function updateWorkHour(payload: Partial<WorkHour>): Promise<BaseResponse<WorkHour>> {
    const res = await fetch("/api/admin/settings/jam-kerja", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    return res.json()
}

export async function getHolidays(): Promise<BaseResponse<Holiday[]>> {
    const res = await fetch("/api/admin/settings/hari-libur")
    return res.json()
}

export async function createHoliday(payload: {
    tanggal_mulai: string
    tanggal_selesai: string
    keterangan: string
}): Promise<BaseResponse<Holiday>> {
    const res = await fetch("/api/admin/settings/hari-libur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    return res.json()
}

export async function deleteHoliday(id: number): Promise<BaseResponse<null>> {
    const res = await fetch(`/api/admin/settings/hari-libur/${id}`, {
        method: "DELETE",
    })
    return res.json()
}

export async function updateHoliday(id: number, payload: Partial<Holiday>): Promise<BaseResponse<Holiday>> {
    const res = await fetch(`/api/admin/settings/hari-libur/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    return res.json()
}

export interface GeofencingSettings {
    lokasi_lat: string
    lokasi_long: string
    radius_meter: number
}

export async function getGeofencing(): Promise<BaseResponse<GeofencingSettings>> {
    const res = await fetch("/api/admin/settings/geofencing")
    return res.json()
}

export async function updateGeofencing(payload: GeofencingSettings): Promise<BaseResponse<GeofencingSettings>> {
    const res = await fetch("/api/admin/settings/geofencing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    return res.json()
}

export interface SupervisorLurahSettings {
    nama: string
    nip: string
}

export async function getSupervisorLurah(): Promise<BaseResponse<SupervisorLurahSettings>> {
    const res = await fetch("/api/admin/settings/supervisor-lurah")
    return res.json()
}

export async function updateSupervisorLurah(payload: SupervisorLurahSettings): Promise<BaseResponse<SupervisorLurahSettings>> {
    const res = await fetch("/api/admin/settings/supervisor-lurah", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    return res.json()
}

