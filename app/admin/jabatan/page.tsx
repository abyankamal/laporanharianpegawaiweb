"use client"

import * as React from "react"
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Briefcase,
    Building2,
    Users
} from "lucide-react"

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
import { FormJabatanModal } from "@/components/FormJabatanModal"

import {
    getJabatans,
    deleteJabatan,
    createJabatan,
    updateJabatan,
    Jabatan
} from "@/lib/api/positions"
import { toast } from "sonner"

export default function ManajemenJabatanPage() {
    const [loading, setLoading] = React.useState(true)
    const [jabatans, setJabatans] = React.useState<Jabatan[]>([])
    const [searchTerm, setSearchTerm] = React.useState("")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [totalData, setTotalData] = React.useState(0)
    const [limit, setLimit] = React.useState(10)

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setCurrentPage(1)
    }

    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [selectedJabatan, setSelectedJabatan] = React.useState<Jabatan | null>(null)
    const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
    const [formModeData, setFormModeData] = React.useState<Jabatan | null>(null)

    const fetchJabatans = React.useCallback(async () => {
        setLoading(true)
        try {
            const response = await getJabatans()
            if (response.success) {
                setJabatans(response.data || [])
                setTotalData(response.data?.length || 0)
                setTotalPages(Math.ceil((response.data?.length || 0) / limit) || 1)
            } else {
                if (
                    response.message === "User tidak terautentikasi" ||
                    response.message === "Role tidak ditemukan" ||
                    response.message?.includes("Token tidak valid") ||
                    response.message?.includes("kadal")
                ) {
                    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
                    window.location.href = '/'
                    return;
                }
            }
        } catch (error) {
            console.error("Error fetching jabatans:", error)
            toast.error("Gagal mengambil data jabatan")
        } finally {
            setLoading(false)
        }
    }, [limit])

    React.useEffect(() => {
        fetchJabatans()
    }, [fetchJabatans])

    const filteredJabatans = jabatans
        .filter(j => (j.nama || "").toLowerCase().includes(searchTerm.toLowerCase()))

    React.useEffect(() => {
        setTotalData(filteredJabatans.length)
        setTotalPages(Math.ceil(filteredJabatans.length / limit) || 1)
        setCurrentPage(1)
    }, [searchTerm, jabatans.length, limit])

    const paginatedJabatans = filteredJabatans.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    )

    const handleAddClick = () => {
        setFormModeData(null)
        setIsFormModalOpen(true)
    }

    const handleEditClick = (item: Jabatan) => {
        setFormModeData(item)
        setIsFormModalOpen(true)
    }

    const handleDeleteClick = (item: Jabatan) => {
        setSelectedJabatan(item)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedJabatan) return
        try {
            const res = await deleteJabatan(selectedJabatan.id)
            if (res.success) {
                toast.success("Jabatan berhasil dihapus")
                fetchJabatans()
            } else {
                toast.error(res.message || "Gagal menghapus jabatan")
            }
        } catch {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsDeleteModalOpen(false)
        }
    }

    const handleSave = async (data: { id?: number; nama: string }) => {
        try {
            if (data.id) {
                const res = await updateJabatan(data.id, { nama: data.nama })
                if (res.success) {
                    toast.success("Jabatan berhasil diperbarui")
                } else {
                    toast.error(res.message)
                }
            } else {
                const res = await createJabatan({ nama: data.nama })
                if (res.success) {
                    toast.success("Jabatan berhasil ditambahkan")
                } else {
                    toast.error(res.message)
                }
            }
            fetchJabatans()
        } catch {
            toast.error("Gagal menyimpan data jabatan")
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-1 sm:p-2 selection:bg-blue-600 selection:text-white">
            
            {/* Header: Eyebrow + Title + Add Button */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                        <Building2 className="size-3.5 text-slate-500" />
                        <span>Nomenklatur Jabatan Organisasi</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">Kelurahan Sukanegla</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Manajemen Jabatan
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Daftar formasi dan penamaan jabatan aparatur sipil kelurahan untuk klasifikasi tugas dan laporan kerja.
                    </p>
                </div>

                {/* Island Actions (Add Jabatan Button) */}
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleAddClick}
                        className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    >
                        <span>Tambah Jabatan</span>
                        <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:rotate-90 group-hover:bg-white/25">
                            <Plus className="size-3.5" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Filter Bar: Search Box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        className="w-full h-10 pl-10 pr-4 bg-white rounded-full border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm transition-all"
                        placeholder="Cari nama jabatan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                    <TableHead className="min-w-[320px] text-[11px] font-bold uppercase tracking-wider text-slate-500">NAMA JABATAN FORMAL</TableHead>
                                    <TableHead className="text-right min-w-[120px] text-[11px] font-bold uppercase tracking-wider text-slate-500">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-100">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
                                                <span className="text-xs font-semibold text-slate-500">Memuat data jabatan...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedJabatans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-32 text-center text-slate-400">
                                            <div className="space-y-1">
                                                <Briefcase className="size-6 mx-auto opacity-30" />
                                                <p className="text-xs font-medium">Tidak ada data jabatan yang cocok.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedJabatans.map((item, index) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <TableCell className="text-center text-xs font-mono text-slate-400">
                                                {(currentPage - 1) * limit + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
                                                        <Briefcase className="size-3.5" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900">
                                                        {item.nama}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Edit Jabatan"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Hapus Jabatan"
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
                            itemName="jabatan"
                        />
                    </div>

                </div>
            </div>

            {/* Modals */}
            <FormJabatanModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                jabatanData={formModeData}
                onSave={handleSave}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedJabatan?.nama || "Jabatan"}
            />

        </div>
    )
}
