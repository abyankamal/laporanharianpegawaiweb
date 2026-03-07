"use client"

import * as React from "react"
import {
    Search,
    Plus,
    Pencil,
    Eye,
    Trash2,
    CheckCircle2,
    Clock,
    History,
    Users,
    Filter,
    Calendar,
    Lightbulb
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"

import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { FormPengumumanModal, PengumumanData } from "@/components/FormPengumumanModal"
import { getAnnouncements, deleteAnnouncement, Announcement, AnnouncementStatistik } from "@/lib/api/announcements"

export default function PusatPengumumanPage() {
    const [search, setSearch] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [statusFilter, setStatusFilter] = React.useState("semua")
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const [announcements, setAnnouncements] = React.useState<Announcement[]>([])
    const [stats, setStats] = React.useState<AnnouncementStatistik>({
        aktif: 0,
        terjadwal: 0,
        kedaluwarsa: 0
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
            const response = await getAnnouncements(currentPage, 10, search)
            if (response.success) {
                setAnnouncements(response.data.list)
                setStats(response.data.statistik)
                setTotalPages(response.data.pagination.total_page)
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError("Gagal memuat data pengumuman")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, search])

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
        // Extract ID from id_pengumuman (ANNC-2026-001 -> 1)
        const parts = item.id_pengumuman.split("-")
        const id = parseInt(parts[parts.length - 1])

        setFormModeData({
            id: id,
            judul: item.judul,
            audience: item.audience,
            status: item.status,
            tanggalPublish: format(new Date(item.tanggal), "yyyy-MM-dd"),
            waktuPublish: format(new Date(item.tanggal), "HH:mm"),
            isi: item.pesan
        })
        setIsFormModalOpen(true)
    }

    const handleSavePengumuman = async () => {
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
                fetchAnnouncements()
            } else {
                alert(response.message)
            }
        } catch (err) {
            console.error(err)
            alert("Gagal menghapus pengumuman")
        } finally {
            setIsDeleteModalOpen(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 p-1">
            {/* Header Halaman & Tombol Aksi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Pusat Pengumuman</h1>
                    <p className="text-muted-foreground text-sm">
                        Kelola dan publikasikan informasi resmi kepada seluruh pegawai SIOPIK.
                    </p>
                </div>
                <Button
                    className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm shrink-0 text-white"
                    onClick={handleCreateNewClick}
                >
                    <Plus className="size-4" />
                    <span>Buat Pengumuman Baru</span>
                </Button>
            </div>

            {/* Widget Statistik (Grid 3 Kolom) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Aktif */}
                <Card className="shadow-sm border-muted-foreground/10">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="size-14 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="size-7 text-green-600 dark:text-green-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground">Aktif Saat Ini</span>
                            <span className="text-3xl font-bold text-foreground">{stats.aktif}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2: Terjadwal */}
                <Card className="shadow-sm border-muted-foreground/10">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="size-14 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                            <Clock className="size-7 text-blue-600 dark:text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground">Terjadwal</span>
                            <span className="text-3xl font-bold text-foreground">{stats.terjadwal}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Kedaluwarsa */}
                <Card className="shadow-sm border-muted-foreground/10">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            <History className="size-7 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground">Total Kedaluwarsa</span>
                            <span className="text-3xl font-bold text-foreground">{stats.kedaluwarsa}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Card Tabel Data & Filter */}
            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden flex flex-col pt-6">
                {/* Baris Filter */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 mb-6">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari judul pengumuman..."
                            className="pl-9 h-10 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[180px] h-10">
                                <div className="flex items-center gap-2">
                                    <Filter className="size-4 text-muted-foreground" />
                                    <SelectValue placeholder="Filter Status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="semua">Semua Status</SelectItem>
                                <SelectItem value="Aktif">Aktif</SelectItem>
                                <SelectItem value="Terjadwal">Terjadwal</SelectItem>
                                <SelectItem value="Kedaluwarsa">Kedaluwarsa</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="h-10 flex items-center gap-2 shrink-0">
                            <Calendar className="size-4" />
                            <span>Urutkan</span>
                        </Button>
                    </div>
                </div>

                {/* Tabel Data */}
                <div className="overflow-x-auto border-t">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="min-w-[300px] pl-6">JUDUL PENGUMUMAN</TableHead>
                                <TableHead className="min-w-[150px]">TANGGAL PUBLISH</TableHead>
                                <TableHead className="min-w-[140px]">STATUS</TableHead>
                                <TableHead className="min-w-[180px]">AUDIENCE</TableHead>
                                <TableHead className="text-right min-w-[120px] pr-6">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Memuat data...
                                    </TableCell>
                                </TableRow>
                            ) : announcements.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        {error || "Tidak ada pengumuman yang ditemukan."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                announcements.map((item) => (
                                    <TableRow key={item.id_pengumuman} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="pl-6">
                                            <div className="flex flex-col py-1">
                                                <span className="font-bold text-[15px] text-foreground leading-tight mb-1">
                                                    {item.judul}
                                                </span>
                                                <span className="text-xs font-mono text-muted-foreground">
                                                    ID: {item.id_pengumuman}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium text-foreground/80">
                                            {format(new Date(item.tanggal), "dd MMM yyyy", { locale: localeID })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "px-2.5 py-1 text-xs font-medium rounded-full border-transparent tracking-wide w-fit gap-1.5",
                                                    item.status === "Aktif" && "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                                                    item.status === "Terjadwal" && "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
                                                    item.status === "Kedaluwarsa" && "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400"
                                                )}
                                            >
                                                {item.status === "Aktif" && <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />}
                                                {item.status === "Terjadwal" && <span className="size-1.5 rounded-full bg-blue-500" />}
                                                {item.status === "Kedaluwarsa" && <span className="size-1.5 rounded-full bg-slate-400" />}
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 w-fit px-2.5 py-1 rounded-md border text-sm">
                                                <Users className="size-4 shrink-0" />
                                                <span className="font-medium text-foreground/80">{item.audience}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                                    onClick={() => {
                                                        alert(item.pesan)
                                                    }}
                                                >
                                                    <Eye className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30"
                                                    onClick={() => handleEditClick(item)}
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-muted-foreground hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                                    onClick={() => handleDeleteClick(item)}
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

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/10">
                        <p className="text-sm text-muted-foreground">
                            Halaman <span className="font-medium text-foreground">{currentPage}</span> dari <span className="font-medium text-foreground">{totalPages}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Bagian Tips (Footer Halaman) */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start mb-4">
                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                    <Lightbulb className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300">Tips Pengelolaan Pengumuman</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400/80 leading-relaxed">
                        Pengumuman dengan status &quot;Aktif&quot; akan langsung muncul di dashboard utama seluruh pegawai yang menjadi target audiens. Anda juga dapat membuat pengumuman dengan status &quot;Terjadwal&quot; yang akan otomatis terpublikasi pada tanggal yang telah Anda tentukan.
                    </p>
                </div>
            </div>

            {/* Integasi Modal Hapus */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedPengumuman?.judul || ""}
            />

            {/* Integasi Modal Form Pengumuman */}
            <FormPengumumanModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                pengumumanData={formModeData}
                onSave={handleSavePengumuman}
            />
        </div>
    )
}
