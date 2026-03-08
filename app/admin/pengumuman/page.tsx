"use client"

import * as React from "react"
import {
    Search,
    Plus,
    Pencil,
    Eye,
    Trash2,
    CheckCircle2,
    Users,
    Calendar,
    Lightbulb
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"

import { CustomPagination } from "@/components/CustomPagination"

import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { FormPengumumanModal, PengumumanData } from "@/components/FormPengumumanModal"
import { getAnnouncements, deleteAnnouncement, Announcement, AnnouncementStatistik } from "@/lib/api/announcements"
import { toast } from "sonner"

export default function PusatPengumumanPage() {
    const [search, setSearch] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

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
            const response = await getAnnouncements(currentPage, 10, search)
            if (response && response.success && response.data) {
                setAnnouncements(response.data.list || [])
                setStats(response.data.statistik || { aktif: 0 })
                setTotalPages(response.data.pagination?.total_page || 1)
            } else {
                setError(response?.message || "Gagal mengambil data")
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
        toast.success(formModeData?.id ? "Pengumuman Diperbarui" : "Pengumuman Berhasil Dibuat")
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
                toast.success("Pengumuman Dihapus")
                fetchAnnouncements()
            } else {
                toast.error(response.message || "Gagal menghapus pengumuman")
            }
        } catch (err) {
            console.error(err)
            toast.error("Gagal menghapus pengumuman")
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

            {/* Widget Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

            {/* Card Tabel Data & Filter */}
            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden flex flex-col pt-6">
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
                        <Button variant="outline" className="h-10 flex items-center gap-2 shrink-0">
                            <Calendar className="size-4" />
                            <span>Urutkan</span>
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto border-t">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="min-w-[300px] pl-6">JUDUL PENGUMUMAN</TableHead>
                                <TableHead className="min-w-[150px]">TANGGAL PUBLISH</TableHead>
                                <TableHead className="min-w-[180px]">AUDIENCE</TableHead>
                                <TableHead className="text-right min-w-[120px] pr-6">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Memuat data...
                                    </TableCell>
                                </TableRow>
                            ) : (announcements?.length ?? 0) === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        {error || "Tidak ada pengumuman yang ditemukan."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                announcements?.map((item) => (
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
                                                    onClick={() => alert(item.pesan)}
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

                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemName="pengumuman"
                />
            </Card>

            {/* Bagian Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start mb-4">
                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                    <Lightbulb className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300">Tips Pengelolaan Pengumuman</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400/80 leading-relaxed">
                        Pengumuman yang dibuat akan langsung muncul di dashboard utama seluruh pegawai yang menjadi target audiens. Pastikan isi pengumuman sudah benar sebelum mempublikasikannya.
                    </p>
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedPengumuman?.judul || ""}
            />

            <FormPengumumanModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                pengumumanData={formModeData}
                onSave={handleSavePengumuman}
            />
        </div>
    )
}
