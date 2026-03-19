"use client"

import * as React from "react"
import { Clock, Save, Trash2, Plus, Pencil } from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
    WorkHour,
    Holiday,
} from "@/lib/api/settings"
import { toast } from "sonner"

import { FormHariLiburModal } from "@/components/FormHariLiburModal"

export default function PengaturanPage() {
    // State for Work Hours
    const [id, setId] = React.useState<number | null>(null)
    const [jamMasukNormal, setJamMasukNormal] = React.useState("07:30")
    const [jamPulangNormal, setJamPulangNormal] = React.useState("16:00")
    const [jamMasukJumat, setJamMasukJumat] = React.useState("07:30")
    const [jamPulangJumat, setJamPulangJumat] = React.useState("16:30")

    // State for Holidays
    const [holidays, setHolidays] = React.useState<Holiday[]>([])
    const [isLoadingHolidays, setIsLoadingHolidays] = React.useState(true)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [limit] = React.useState(5) // Smaller limit for settings page

    // State for Holiday Modal
    const [isHolidayModalOpen, setIsHolidayModalOpen] = React.useState(false)
    const [selectedHoliday, setSelectedHoliday] = React.useState<Holiday | null>(null)

    const fetchSettings = React.useCallback(async () => {
        try {
            const whRes = await getWorkHour()
            if (whRes.status === "success" && whRes.data) {
                setId(whRes.data.id)
                setJamMasukNormal(whRes.data.jam_masuk)
                setJamPulangNormal(whRes.data.jam_pulang)
                setJamMasukJumat(whRes.data.jam_masuk_jumat)
                setJamPulangJumat(whRes.data.jam_pulang_jumat)
            }

            setIsLoadingHolidays(true)
            const hRes = await getHolidays()
            if (hRes.status === "success") {
                setHolidays(hRes.data)
            } else if (hRes.message === "User tidak terautentikasi" ||
                hRes.message === "Role tidak ditemukan" ||
                hRes.message?.includes("Token tidak valid") ||
                hRes.message?.includes("kadal") ||
                (whRes as any).message?.includes("Token tidak valid") ||
                (whRes as any).message?.includes("kadal")
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
        try {
            const res = await updateWorkHour({
                jam_masuk: jamMasukNormal,
                jam_pulang: jamPulangNormal,
                jam_masuk_jumat: jamMasukJumat,
                jam_pulang_jumat: jamPulangJumat,
            })
            if (res.status === "success") {
                toast.success("Jam kerja berhasil disimpan!")
            } else {
                toast.error(res.message || "Gagal menyimpan jam kerja")
            }
        } catch (error) {
            console.error(error)
            toast.error("Terjadi kesalahan saat menyimpan jam kerja")
        }
    }

    const handleDeleteHoliday = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus hari libur ini?")) return

        try {
            const res = await deleteHoliday(id)
            if (res.status === "success") {
                toast.success("Hari libur berhasil dihapus")
                fetchSettings()
            } else {
                toast.error(res.message || "Gagal menghapus hari libur")
            }
        } catch (error) {
            console.error(error)
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
        <div className="flex flex-col gap-6 p-1">
            {/* Header Halaman */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Kelola Jam Kerja & Hari Libur</h1>
                <p className="text-muted-foreground text-sm">
                    Atur konfigurasi waktu operasional dan kalender libur instansi.
                </p>
            </div>

            {/* Card 1: Pengaturan Jam Kerja */}
            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
                        {/* Kolom Kiri (Ilustrasi) */}
                        <div className="bg-slate-900 rounded-xl flex items-center justify-center p-8 min-h-[250px] relative overflow-hidden">
                            {/* Decorative elements behind the icon */}
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <div className="w-24 h-24 rounded-full border-4 border-white/50" />
                            </div>
                            <div className="absolute bottom-[-20%] left-[-10%] w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />

                            <Clock className="size-32 text-blue-400 opacity-80" />
                        </div>

                        {/* Kolom Kanan (Formulir) */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-foreground">Pengaturan Jam Kerja</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Atur batas waktu laporan harian pegawai agar sistem dapat melakukan validasi kehadiran otomatis.
                                </p>
                            </div>

                            <form onSubmit={handleSaveJamKerja} className="space-y-5">
                                {/* Baris 1: Senin - Kamis */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2 flex flex-col">
                                        <Label htmlFor="jamMasukNormal">Jam Masuk (Senin-Kamis)</Label>
                                        <Input
                                            id="jamMasukNormal"
                                            type="time"
                                            value={jamMasukNormal}
                                            onChange={(e) => setJamMasukNormal(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <Label htmlFor="jamPulangNormal">Jam Pulang (Senin-Kamis)</Label>
                                        <Input
                                            id="jamPulangNormal"
                                            type="time"
                                            value={jamPulangNormal}
                                            onChange={(e) => setJamPulangNormal(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Baris 2: Jumat Khusus */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2 flex flex-col">
                                        <Label htmlFor="jamMasukJumat">Jam Masuk (Jumat)</Label>
                                        <Input
                                            id="jamMasukJumat"
                                            type="time"
                                            value={jamMasukJumat}
                                            onChange={(e) => setJamMasukJumat(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <Label htmlFor="jamPulangJumat">Jam Pulang (Jumat)</Label>
                                        <Input
                                            id="jamPulangJumat"
                                            type="time"
                                            value={jamPulangJumat}
                                            onChange={(e) => setJamPulangJumat(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                        <Save className="size-4" />
                                        <span>Simpan Jam Kerja</span>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Card 2: Daftar Hari Libur */}
            <Card className="shadow-sm border-muted-foreground/10 flex flex-col pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 mb-6">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-foreground">Daftar Hari Libur</h2>
                        <p className="text-sm text-muted-foreground">Hari libur nasional dan instansi tahun 2026</p>
                    </div>
                    <Button
                        className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm shrink-0 text-white"
                        onClick={() => {
                            setSelectedHoliday(null)
                            setIsHolidayModalOpen(true)
                        }}
                    >
                        <Plus className="size-4" />
                        <span>Tambah Hari Libur</span>
                    </Button>
                </div>

                <div className="overflow-x-auto border-y">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="w-[80px] pl-6 text-center">NO</TableHead>
                                <TableHead className="min-w-[200px]">TANGGAL</TableHead>
                                <TableHead className="min-w-[300px]">KETERANGAN</TableHead>
                                <TableHead className="w-[120px] pr-6 text-center">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingHolidays ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Memuat data...
                                    </TableCell>
                                </TableRow>
                            ) : holidays.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Tidak ada hari libur yang terdaftar.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedHolidays.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="pl-6 text-center font-medium text-foreground/70">
                                            {(currentPage - 1) * limit + index + 1}
                                        </TableCell>
                                        <TableCell className="font-medium text-foreground/80">
                                            {item.tanggal_mulai === item.tanggal_selesai
                                                ? format(new Date(item.tanggal_mulai), "dd MMMM yyyy", { locale: localeID })
                                                : `${format(new Date(item.tanggal_mulai), "dd MMM", { locale: localeID })} - ${format(new Date(item.tanggal_selesai), "dd MMM yyyy", { locale: localeID })}`
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className="bg-red-50 text-red-600 hover:bg-red-50 rounded-md font-medium dark:bg-red-900/20"
                                            >
                                                {item.keterangan}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="pr-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 rounded-full text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleEditHoliday(item)}
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 rounded-full text-muted-foreground hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                    onClick={() => handleDeleteHoliday(item.id)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalData={holidays.length}
                    limit={limit}
                    itemName="hari libur"
                />

                <div className="p-4 text-center">
                    <p className="text-xs italic text-muted-foreground">
                        Gunakan tombol di atas untuk menambah data hari libur lainnya.
                    </p>
                </div>
            </Card>

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
