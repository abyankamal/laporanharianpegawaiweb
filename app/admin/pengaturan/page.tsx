"use client"

import * as React from "react"
import {
    Clock,
    Save,
    Trash2,
    Plus,
    Pencil,
    MapPin,
    ShieldCheck,
    Building2,
    Calendar,
    CheckCircle2,
    Sliders,
    Sparkles
} from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CustomPagination } from "@/components/CustomPagination"

import {
    getWorkHour,
    updateWorkHour,
    getHolidays,
    deleteHoliday,
    getGeofencing,
    updateGeofencing,
    getSupervisorLurah,
    updateSupervisorLurah,
    Holiday,
} from "@/lib/api/settings"
import { toast } from "sonner"
import { FormHariLiburModal } from "@/components/FormHariLiburModal"

export default function PengaturanPage() {
    // Work Hours
    const [jamMasukNormal, setJamMasukNormal] = React.useState("07:30")
    const [jamPulangNormal, setJamPulangNormal] = React.useState("16:00")
    const [jamMasukJumat, setJamMasukJumat] = React.useState("07:30")
    const [jamPulangJumat, setJamPulangJumat] = React.useState("16:30")
    const [savingJamKerja, setSavingJamKerja] = React.useState(false)

    // Geofencing
    const [lokasiLat, setLokasiLat] = React.useState("-6.914744")
    const [lokasiLong, setLokasiLong] = React.useState("107.609810")
    const [radiusMeter, setRadiusMeter] = React.useState(100)
    const [savingGeofencing, setSavingGeofencing] = React.useState(false)

    // Supervisor Lurah
    const [namaSupervisor, setNamaSupervisor] = React.useState("")
    const [nipSupervisor, setNipSupervisor] = React.useState("")
    const [savingSupervisor, setSavingSupervisor] = React.useState(false)

    // Holidays
    const [holidays, setHolidays] = React.useState<Holiday[]>([])
    const [isLoadingHolidays, setIsLoadingHolidays] = React.useState(true)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [limit] = React.useState(5)

    // Holiday Modal
    const [isHolidayModalOpen, setIsHolidayModalOpen] = React.useState(false)
    const [selectedHoliday, setSelectedHoliday] = React.useState<Holiday | null>(null)

    const fetchSettings = React.useCallback(async () => {
        try {
            const whRes = await getWorkHour()
            if (whRes.status === "success" && whRes.data) {
                setJamMasukNormal(whRes.data.jam_masuk || "07:30")
                setJamPulangNormal(whRes.data.jam_pulang || "16:00")
                setJamMasukJumat(whRes.data.jam_masuk_jumat || "07:30")
                setJamPulangJumat(whRes.data.jam_pulang_jumat || "16:30")
            }

            const geoRes = await getGeofencing().catch(() => null)
            if (geoRes && (geoRes.status === "success" || (geoRes as any).success) && geoRes.data) {
                if (geoRes.data.lokasi_lat) setLokasiLat(geoRes.data.lokasi_lat)
                if (geoRes.data.lokasi_long) setLokasiLong(geoRes.data.lokasi_long)
                if (geoRes.data.radius_meter) setRadiusMeter(geoRes.data.radius_meter)
            }

            const supRes = await getSupervisorLurah().catch(() => null)
            if (supRes && (supRes.status === "success" || (supRes as any).success) && supRes.data) {
                if (supRes.data.nama) setNamaSupervisor(supRes.data.nama)
                if (supRes.data.nip) setNipSupervisor(supRes.data.nip)
            }

            setIsLoadingHolidays(true)
            const hRes = await getHolidays()
            if (hRes.status === "success") {
                setHolidays(hRes.data || [])
            } else if (
                hRes.message === "User tidak terautentikasi" ||
                hRes.message === "Role tidak ditemukan" ||
                hRes.message?.includes("Token tidak valid") ||
                (whRes as any)?.message?.includes("Token tidak valid")
            ) {
                await fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
                window.location.href = '/'
                return;
            }
        } catch (error) {
            console.error("Gagal mengambil pengaturan:", error)
        } finally {
            setIsLoadingHolidays(false)
        }
    }, [])

    React.useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const handleSaveJamKerja = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingJamKerja(true)
        try {
            const res = await updateWorkHour({
                jam_masuk: jamMasukNormal,
                jam_pulang: jamPulangNormal,
                jam_masuk_jumat: jamMasukJumat,
                jam_pulang_jumat: jamPulangJumat,
            })
            if (res.status === "success" || (res as any).success) {
                toast.success("Jam kerja operasional berhasil disimpan")
            } else {
                toast.error(res.message || "Gagal menyimpan jam kerja")
            }
        } catch {
            toast.error("Terjadi kesalahan saat menyimpan jam kerja")
        } finally {
            setSavingJamKerja(false)
        }
    }

    const handleSaveGeofencing = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingGeofencing(true)
        try {
            const res = await updateGeofencing({
                lokasi_lat: lokasiLat,
                lokasi_long: lokasiLong,
                radius_meter: Number(radiusMeter),
            })
            if (res.status === "success" || (res as any).success) {
                toast.success("Pengaturan geofencing berhasil disimpan")
            } else {
                toast.error(res.message || "Gagal menyimpan geofencing")
            }
        } catch {
            toast.error("Terjadi kesalahan saat menyimpan geofencing")
        } finally {
            setSavingGeofencing(false)
        }
    }

    const handleSaveSupervisor = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingSupervisor(true)
        try {
            const res = await updateSupervisorLurah({
                nama: namaSupervisor,
                nip: nipSupervisor,
            })
            if (res.status === "success" || (res as any).success) {
                toast.success("Data supervisor lurah berhasil disimpan")
            } else {
                toast.error(res.message || "Gagal menyimpan supervisor lurah")
            }
        } catch {
            toast.error("Terjadi kesalahan saat menyimpan supervisor lurah")
        } finally {
            setSavingSupervisor(false)
        }
    }

    const handleDeleteHoliday = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus hari libur ini?")) return

        try {
            const res = await deleteHoliday(id)
            if (res.status === "success" || (res as any).success) {
                toast.success("Hari libur berhasil dihapus")
                fetchSettings()
            } else {
                toast.error(res.message || "Gagal menghapus hari libur")
            }
        } catch {
            toast.error("Terjadi kesalahan saat menghapus hari libur")
        }
    }

    const handleEditHoliday = (holiday: Holiday) => {
        setSelectedHoliday(holiday)
        setIsHolidayModalOpen(true)
    }

    const handleSaveHoliday = async () => {
        if (selectedHoliday) {
            toast.success("Hari libur berhasil diperbarui")
        } else {
            toast.success("Hari libur berhasil ditambahkan")
        }
        fetchSettings()
        setIsHolidayModalOpen(false)
        setSelectedHoliday(null)
    }

    const totalPages = Math.ceil(holidays.length / limit)
    const paginatedHolidays = holidays.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    )

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-1 sm:p-2 selection:bg-blue-600 selection:text-white">
            
            {/* Header: Eyebrow + Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                        <Building2 className="size-3.5 text-slate-500" />
                        <span>Konfigurasi & Parameter Sistem</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">Kelurahan Sukanegla</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Pengaturan Sistem
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Atur parameter jam dinas operasional, batas radius geofencing presensi, penandatangan surat atasan, dan kalender libur.
                    </p>
                </div>
            </div>

            {/* Asymmetrical Bento Configuration Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* 1. Jam Kerja Kantor (7 Cols) */}
                <div className="lg:col-span-7 rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                    <div className="h-full rounded-[calc(2rem-0.5rem)] bg-white p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                                    <Clock className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-900">Jam Kerja Operasional</h2>
                                    <p className="text-xs text-slate-500">Validasi otomatis laporan tepat waktu vs lembur</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                Resmi
                            </span>
                        </div>

                        <form onSubmit={handleSaveJamKerja} className="space-y-5">
                            {/* Hari Senin - Kamis */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                                <span className="text-xs font-bold text-slate-900 block">Senin – Kamis</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="jamMasukNormal" className="text-[11px] font-semibold text-slate-600">Jam Masuk</Label>
                                        <Input
                                            id="jamMasukNormal"
                                            type="time"
                                            value={jamMasukNormal}
                                            onChange={(e) => setJamMasukNormal(e.target.value)}
                                            className="h-10 rounded-xl bg-white border-slate-200 text-xs font-mono"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="jamPulangNormal" className="text-[11px] font-semibold text-slate-600">Jam Pulang</Label>
                                        <Input
                                            id="jamPulangNormal"
                                            type="time"
                                            value={jamPulangNormal}
                                            onChange={(e) => setJamPulangNormal(e.target.value)}
                                            className="h-10 rounded-xl bg-white border-slate-200 text-xs font-mono"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hari Jumat Khusus */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                                <span className="text-xs font-bold text-slate-900 block">Jumat (Jadwal Khusus)</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="jamMasukJumat" className="text-[11px] font-semibold text-slate-600">Jam Masuk</Label>
                                        <Input
                                            id="jamMasukJumat"
                                            type="time"
                                            value={jamMasukJumat}
                                            onChange={(e) => setJamMasukJumat(e.target.value)}
                                            className="h-10 rounded-xl bg-white border-slate-200 text-xs font-mono"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="jamPulangJumat" className="text-[11px] font-semibold text-slate-600">Jam Pulang</Label>
                                        <Input
                                            id="jamPulangJumat"
                                            type="time"
                                            value={jamPulangJumat}
                                            onChange={(e) => setJamPulangJumat(e.target.value)}
                                            className="h-10 rounded-xl bg-white border-slate-200 text-xs font-mono"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={savingJamKerja}
                                className="group inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                            >
                                <span>{savingJamKerja ? "Menyimpan..." : "Simpan Jam Kerja"}</span>
                                <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:bg-white/25">
                                    <Save className="size-3.5" />
                                </div>
                            </button>
                        </form>

                    </div>
                </div>

                {/* 2. Geofencing & Supervisor Lurah (5 Cols) */}
                <div className="lg:col-span-5 grid grid-cols-1 gap-6">
                    
                    {/* Geofencing Hardware Card */}
                    <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                        <div className="h-full rounded-[calc(2rem-0.5rem)] bg-white p-6 space-y-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                                    <MapPin className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Geofencing Presensi</h3>
                                    <p className="text-[11px] text-slate-500">Koordinat titik kantor & radius presensi</p>
                                </div>
                            </div>

                            <form onSubmit={handleSaveGeofencing} className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="lokasiLat" className="text-[11px] font-semibold text-slate-600">Latitude</Label>
                                        <Input
                                            id="lokasiLat"
                                            value={lokasiLat}
                                            onChange={(e) => setLokasiLat(e.target.value)}
                                            className="h-9 rounded-xl bg-slate-50 border-slate-200 text-xs font-mono"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="lokasiLong" className="text-[11px] font-semibold text-slate-600">Longitude</Label>
                                        <Input
                                            id="lokasiLong"
                                            value={lokasiLong}
                                            onChange={(e) => setLokasiLong(e.target.value)}
                                            className="h-9 rounded-xl bg-slate-50 border-slate-200 text-xs font-mono"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="radiusMeter" className="text-[11px] font-semibold text-slate-600">Radius Toleransi (Meter)</Label>
                                    <Input
                                        id="radiusMeter"
                                        type="number"
                                        min="10"
                                        max="5000"
                                        value={radiusMeter}
                                        onChange={(e) => setRadiusMeter(Number(e.target.value))}
                                        className="h-9 rounded-xl bg-slate-50 border-slate-200 text-xs font-mono"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={savingGeofencing}
                                    className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {savingGeofencing ? "Menyimpan..." : "Simpan Geofencing"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Supervisor Lurah Hardware Card */}
                    <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                        <div className="h-full rounded-[calc(2rem-0.5rem)] bg-white p-6 space-y-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                                    <ShieldCheck className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Penandatangan Laporan</h3>
                                    <p className="text-[11px] text-slate-500">Pejabat Lurah penandatangan dokumen resmi</p>
                                </div>
                            </div>

                            <form onSubmit={handleSaveSupervisor} className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="namaSupervisor" className="text-[11px] font-semibold text-slate-600">Nama Pejabat</Label>
                                    <Input
                                        id="namaSupervisor"
                                        value={namaSupervisor}
                                        onChange={(e) => setNamaSupervisor(e.target.value)}
                                        className="h-9 rounded-xl bg-slate-50 border-slate-200 text-xs font-medium"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="nipSupervisor" className="text-[11px] font-semibold text-slate-600">NIP Pejabat</Label>
                                    <Input
                                        id="nipSupervisor"
                                        value={nipSupervisor}
                                        onChange={(e) => setNipSupervisor(e.target.value)}
                                        className="h-9 rounded-xl bg-slate-50 border-slate-200 text-xs font-mono"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={savingSupervisor}
                                    className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {savingSupervisor ? "Menyimpan..." : "Simpan Penandatangan"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>

            </div>

            {/* 3. Daftar Hari Libur (Full Width Double-Bezel) */}
            <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                <div className="rounded-[calc(2rem-0.5rem)] bg-white overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                    
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                Kalender Hari Libur Nasional & Instansi
                            </h3>
                            <p className="text-xs text-slate-500">
                                Tanggal libur resmi di mana pegawai tidak diwajibkan melakukan presensi harian
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedHoliday(null)
                                setIsHolidayModalOpen(true)
                            }}
                            className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer self-start sm:self-auto"
                        >
                            <span>Tambah Libur</span>
                            <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:rotate-90 group-hover:bg-white/25">
                                <Plus className="size-3.5" />
                            </div>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                <TableRow>
                                    <TableHead className="w-16 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">NO</TableHead>
                                    <TableHead className="min-w-[240px] text-[11px] font-bold uppercase tracking-wider text-slate-500">RENTANG TANGGAL</TableHead>
                                    <TableHead className="min-w-[320px] text-[11px] font-bold uppercase tracking-wider text-slate-500">KETERANGAN HARI LIBUR</TableHead>
                                    <TableHead className="text-right min-w-[120px] text-[11px] font-bold uppercase tracking-wider text-slate-500">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-100">
                                {isLoadingHolidays ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
                                                <span className="text-xs font-semibold text-slate-500">Memuat hari libur...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : holidays.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                                            <div className="space-y-1">
                                                <Calendar className="size-6 mx-auto opacity-30" />
                                                <p className="text-xs font-medium">Tidak ada hari libur yang terdaftar.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedHolidays.map((item, index) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <TableCell className="text-center text-xs font-mono text-slate-400">
                                                {(currentPage - 1) * limit + index + 1}
                                            </TableCell>
                                            <TableCell className="text-xs font-bold text-slate-900 font-mono">
                                                {item.tanggal_mulai === item.tanggal_selesai
                                                    ? format(new Date(item.tanggal_mulai), "dd MMMM yyyy", { locale: localeID })
                                                    : `${format(new Date(item.tanggal_mulai), "dd MMM", { locale: localeID })} – ${format(new Date(item.tanggal_selesai), "dd MMM yyyy", { locale: localeID })}`
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs font-medium text-slate-700">
                                                    {item.keterangan}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleEditHoliday(item)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Edit Hari Libur"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteHoliday(item.id)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Hapus Hari Libur"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="p-4 border-t border-slate-100">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalData={holidays.length}
                            limit={limit}
                            itemName="hari libur"
                        />
                    </div>

                </div>
            </div>

            {/* Modal Form Tambah Hari Libur */}
            <FormHariLiburModal
                isOpen={isHolidayModalOpen}
                onClose={() => {
                    setIsHolidayModalOpen(false)
                    setSelectedHoliday(null)
                }}
                onSave={handleSaveHoliday}
                holidayData={selectedHoliday}
            />

        </div>
    )
}
