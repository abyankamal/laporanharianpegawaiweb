"use client"

import * as React from "react"
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    CheckCircle2,
    Users,
    Calendar,
    Megaphone,
    Building2,
    Globe,
    Radio
} from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"

import { CustomPagination } from "@/components/CustomPagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { FormPengumumanModal, PengumumanData } from "@/components/FormPengumumanModal"
import { getAnnouncements, deleteAnnouncement, Announcement, AnnouncementStatistik } from "@/lib/api/announcements"
import { toast } from "sonner"

export default function PusatPengumumanPage() {
    const [search, setSearch] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [totalData, setTotalData] = React.useState(0)
    const [isLoading, setIsLoading] = React.useState(true)
    const [limit, setLimit] = React.useState(10)
    const [error, setError] = React.useState<string | null>(null)

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setCurrentPage(1)
    }

    const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
    const [stats, setStats] = React.useState<AnnouncementStatistik>({
        aktif: 0
    })

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [selectedPengumuman, setSelectedPengumuman] = React.useState<Announcement | null>(null)

    const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
    const [formModeData, setFormModeData] = React.useState<PengumumanData | null>(null)

    const fetchAnnouncements = React.useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await getAnnouncements(currentPage, limit, search)
            if (response && response.success && response.data) {
                setAnnouncements(response.data.list || [])
                setStats(response.data.statistik || { aktif: 0 })
                setTotalPages(response.data.pagination?.total_page || 1)
                setTotalData(response.data.pagination?.total_data || 0)
            } else {
                if (
                    response?.message === "User tidak terautentikasi" ||
                    response?.message === "Role tidak ditemukan" ||
                    response?.message?.includes("Token tidak valid") ||
                    response?.message?.includes("kadal")
                ) {
                    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
                    window.location.href = '/'
                    return;
                }
                setError(response?.message || "Gagal mengambil data")
            }
        } catch {
            setError("Gagal memuat data pengumuman")
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, search, limit])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchAnnouncements()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [fetchAnnouncements])

    const handleCreateNewClick = () => {
        setFormModeData(null)
        setIsFormModalOpen(true)
    }

    const handleEditClick = (item: Announcement) => {
        const parts = item.id_pengumuman.split("-")
        const id = parseInt(parts[parts.length - 1])

        setFormModeData({
            id: id,
            judul: item.judul,
            audience: item.audience,
            status: "Aktif",
            tanggalPublish: format(new Date(item.tanggal), "yyyy-MM-dd"),
            waktuPublish: format(new Date(item.tanggal), "HH:mm"),
            isi: item.pesan
        })
        setIsFormModalOpen(true)
    }

    const handleSavePengumuman = async () => {
        toast.success(formModeData?.id ? "Pengumuman berhasil diperbarui" : "Pengumuman berhasil dipublikasikan")
        fetchAnnouncements()
        setIsFormModalOpen(false)
    }

    const handleDeleteClick = (item: Announcement) => {
        setSelectedPengumuman(item)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedPengumuman) return

        try {
            const parts = selectedPengumuman.id_pengumuman.split("-")
            const id = parseInt(parts[parts.length - 1])
            const response = await deleteAnnouncement(id)
            if (response.success) {
                toast.success("Pengumuman berhasil dihapus")
                fetchAnnouncements()
            } else {
                toast.error(response.message || "Gagal menghapus pengumuman")
            }
        } catch {
            toast.error("Gagal menghapus pengumuman")
        } finally {
            setIsDeleteModalOpen(false)
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-1 sm:p-2 selection:bg-blue-600 selection:text-white">
            
            {/* Header: Eyebrow + Title + Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                        <Building2 className="size-3.5 text-slate-500" />
                        <span>Saluran Informasi & Surat Edaran</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">Kelurahan Sukanegla</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Pusat Pengumuman
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Publikasi informasi resmi, edaran dinas, dan instruksi pimpinan kepada seluruh aparatur kelurahan.
                    </p>
                </div>

                {/* Island Actions (Add Announcement Button) */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleCreateNewClick}
                        className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    >
                        <span>Buat Pengumuman</span>
                        <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:rotate-90 group-hover:bg-white/25">
                            <Plus className="size-3.5" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Asymmetrical Bento Header Stats & Search */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                
                {/* Metric Tile: Total Pengumuman Aktif (4 Cols) */}
                <div className="md:col-span-4 rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                    <div className="rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex items-center justify-between shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Siaran Berjalan
                            </span>
                            <h3 className="text-sm font-bold text-slate-900">Pengumuman Aktif</h3>
                            <p className="text-[11px] text-slate-500">Tampil di aplikasi mobile pegawai</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight tabular-nums">
                                {stats.aktif}
                            </div>
                            <span className="text-[10px] text-slate-400">Siaran</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar (8 Cols) */}
                <div className="md:col-span-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        className="w-full h-12 pl-11 pr-4 bg-white rounded-full border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm transition-all"
                        placeholder="Cari judul pengumuman atau kata kunci edaran..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

            </div>

            {/* Main Table: Double-Bezel Hardware Architecture */}
            <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                <div className="rounded-[calc(2rem-0.5rem)] bg-white overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                    
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                <TableRow>
                                    <TableHead className="w-16 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">NO</TableHead>
                                    <TableHead className="min-w-[320px] text-[11px] font-bold uppercase tracking-wider text-slate-500">JUDUL & ISI PENGUMUMAN</TableHead>
                                    <TableHead className="min-w-[160px] text-[11px] font-bold uppercase tracking-wider text-slate-500">TANGGAL PUBLIKASI</TableHead>
                                    <TableHead className="min-w-[140px] text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">TARGET AUDIENS</TableHead>
                                    <TableHead className="text-right min-w-[120px] text-[11px] font-bold uppercase tracking-wider text-slate-500">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
                                                <span className="text-xs font-semibold text-slate-500">Memuat pengumuman...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : announcements.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-slate-400">
                                            <div className="space-y-1">
                                                <Megaphone className="size-6 mx-auto opacity-30" />
                                                <p className="text-xs font-medium">{error || "Belum ada pengumuman yang dibuat."}</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    announcements.map((item, index) => (
                                        <TableRow key={item.id_pengumuman} className="hover:bg-slate-50/60 transition-colors group">
                                            <TableCell className="text-center text-xs font-mono text-slate-400">
                                                {(currentPage - 1) * limit + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1 py-1 max-w-[420px]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-900 block truncate" title={item.judul}>
                                                            {item.judul}
                                                        </span>
                                                        <span className="text-[9px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-100">
                                                            {item.id_pengumuman}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                                        {item.pesan}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs font-mono text-slate-700">
                                                {format(new Date(item.tanggal), "dd MMM yyyy, HH:mm", { locale: localeID })}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5">
                                                    <Users className="size-3" />
                                                    <span>{item.audience || "Semua Pegawai"}</span>
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Edit Pengumuman"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Hapus Pengumuman"
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
                            totalData={totalData}
                            limit={limit}
                            onLimitChange={handleLimitChange}
                            itemName="pengumuman"
                        />
                    </div>

                </div>
            </div>

            {/* Modals */}
            <FormPengumumanModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                pengumumanData={formModeData}
                onSave={handleSavePengumuman}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedPengumuman?.judul || "Pengumuman"}
            />

        </div>
    )
}
