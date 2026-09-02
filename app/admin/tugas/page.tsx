"use client"

import { BACKEND_URL } from "@/lib/api-config"
import * as React from "react"
import { format, isPast, differenceInDays } from "date-fns"
import { id as localeID } from "date-fns/locale"
import {
    Plus,
    Pencil,
    Trash2,
    FileText,
    ExternalLink,
    CalendarCheck,
    Clock,
    Users,
    Building2,
    LayoutGrid,
    Table as TableIcon,
    AlertCircle,
    CheckCircle2,
    FileCheck
} from "lucide-react"

import { CustomPagination } from "@/components/CustomPagination"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FormTugasModal, TugasData } from "@/components/FormTugasModal"
import { getTasks, createTask, updateTask, deleteTask, Task } from "@/lib/api/tasks"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function PemantauanTugasPage() {
    const [tasks, setTasks] = React.useState<Task[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [viewMode, setViewMode] = React.useState<"table" | "board">("table")
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [totalData, setTotalData] = React.useState(0)
    const [limit, setLimit] = React.useState(10)

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setCurrentPage(1)
    }

    // Modal State
    const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
    const [formModeData, setFormModeData] = React.useState<TugasData | null>(null)

    // Delete Confirmation State
    const [deleteId, setDeleteId] = React.useState<number | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    const fetchTasks = React.useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getTasks()
            if (response.success) {
                setTasks(response.data || [])
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
                setError(response.message || "Gagal mengambil data tugas")
            }
        } catch (err) {
            console.error("Error fetching tasks:", err)
            setError("Terjadi kesalahan saat menghubungi server")
        } finally {
            setLoading(false)
        }
    }, [limit])

    React.useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    const handleAddTugasClick = () => {
        setFormModeData(null)
        setIsFormModalOpen(true)
    }

    const handleEditTugasClick = (item: Task) => {
        setFormModeData({
            id: item.id,
            judul_tugas: item.judul_tugas,
            deskripsi: item.deskripsi,
            deadline: item.deadline,
            assignees: item.assignees,
            file_bukti: item.file_bukti
        })
        setIsFormModalOpen(true)
    }

    const handleSaveTugas = async (formData: FormData) => {
        try {
            if (formModeData?.id) {
                const res = await updateTask(formModeData.id, formData)
                if (res.success) {
                    toast.success("Tugas berhasil diperbarui")
                }
            } else {
                const res = await createTask(formData)
                if (res.success) {
                    toast.success("Tugas berhasil ditambahkan")
                }
            }
            fetchTasks()
        } catch (err) {
            console.error("Error saving task:", err)
            toast.error("Gagal menyimpan tugas")
        }
    }

    const handleDeleteClick = (id: number) => {
        setDeleteId(id)
    }

    const confirmDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            const response = await deleteTask(deleteId)
            if (response.success) {
                toast.success("Tugas berhasil dihapus")
                fetchTasks()
            } else {
                toast.error(response.message || "Gagal menghapus tugas")
            }
        } catch {
            toast.error("Gagal menghapus tugas")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const handleViewFile = (filePath: string) => {
        const fullUrl = `${BACKEND_URL}/${filePath.replace(/^\//, '')}`
        window.open(fullUrl, '_blank')
    }

    const paginatedTasks = tasks.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    )

    const getDeadlineBadge = (deadlineStr?: string | null) => {
        if (!deadlineStr) return null
        try {
            const d = new Date(deadlineStr)
            const isOverdue = isPast(d)
            const daysLeft = differenceInDays(d, new Date())

            if (isOverdue) {
                return (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        Lewat Batas
                    </span>
                )
            }
            if (daysLeft <= 2) {
                return (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Mendesak ({daysLeft}h)
                    </span>
                )
            }
            return (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Aktif
                </span>
            )
        } catch {
            return null
        }
    }

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-1 sm:p-2 selection:bg-blue-600 selection:text-white">
            
            {/* Header: Eyebrow + Title + Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                        <Building2 className="size-3.5 text-slate-500" />
                        <span>Manajemen Penugasan Organisasi</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">Kelurahan Sukanegla</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Pemantauan Tugas
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Delegasi tugas, pemantauan tenggat waktu, dan evaluasi hasil kerja aparatur sipil kelurahan.
                    </p>
                </div>

                {/* Island Actions (View Toggle + Add Task Button) */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* View Switcher Pill */}
                    <div className="p-1 rounded-full bg-slate-100 border border-slate-200 flex items-center gap-1">
                        <button
                            onClick={() => setViewMode("table")}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                viewMode === "table"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <TableIcon className="size-3.5" />
                            <span>Tabel</span>
                        </button>
                        <button
                            onClick={() => setViewMode("board")}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                viewMode === "board"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            <LayoutGrid className="size-3.5" />
                            <span>Kartu</span>
                        </button>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={handleAddTugasClick}
                        className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    >
                        <span>Tambah Tugas</span>
                        <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:rotate-90 group-hover:bg-white/25">
                            <Plus className="size-3.5" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Content Container: Double-Bezel Hardware Architecture */}
            <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                <div className="rounded-[calc(2rem-0.5rem)] bg-white overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                    
                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                            <div className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
                            <span className="text-xs font-semibold text-slate-500">Memuat data tugas...</span>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 space-y-2">
                            <CalendarCheck className="size-8 mx-auto opacity-30" />
                            <p className="text-xs font-medium">Belum ada tugas organisasi yang dibuat.</p>
                        </div>
                    ) : viewMode === "table" ? (
                        /* TABEL VIEW */
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                    <TableRow>
                                        <TableHead className="w-12 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">NO</TableHead>
                                        <TableHead className="min-w-[280px] text-[11px] font-bold uppercase tracking-wider text-slate-500">JUDUL & DESKRIPSI TUGAS</TableHead>
                                        <TableHead className="min-w-[200px] text-[11px] font-bold uppercase tracking-wider text-slate-500">PENANGGUNG JAWAB</TableHead>
                                        <TableHead className="min-w-[160px] text-[11px] font-bold uppercase tracking-wider text-slate-500">BATAS WAKTU (DEADLINE)</TableHead>
                                        <TableHead className="text-center min-w-[120px] text-[11px] font-bold uppercase tracking-wider text-slate-500">LAMPIRAN</TableHead>
                                        <TableHead className="text-right min-w-[100px] text-[11px] font-bold uppercase tracking-wider text-slate-500">AKSI</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-slate-100">
                                    {paginatedTasks.map((item, index) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <TableCell className="text-center text-xs font-mono text-slate-400">
                                                {(currentPage - 1) * limit + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5 max-w-[360px]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-slate-900 block truncate" title={item.judul_tugas}>
                                                            {item.judul_tugas}
                                                        </span>
                                                        {getDeadlineBadge(item.deadline)}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                                                        {item.deskripsi || "Tidak ada deskripsi rincian."}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {item.assignees?.slice(0, 3).map((assignee) => (
                                                            <Avatar key={assignee.id} className="size-7 rounded-xl border-2 border-white shadow-sm">
                                                                <AvatarImage src={assignee.foto_path || ''} alt={assignee.nama} />
                                                                <AvatarFallback className="bg-blue-50 text-blue-700 text-[9px] font-bold font-mono">
                                                                    {assignee.nama.substring(0, 2).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ))}
                                                        {item.assignees && item.assignees.length > 3 && (
                                                            <div className="size-7 rounded-xl border-2 border-white bg-slate-100 text-[9px] font-bold text-slate-600 flex items-center justify-center font-mono">
                                                                +{item.assignees.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-700 truncate max-w-[130px]">
                                                        {item.assignees?.[0]?.nama || "Belum di-assign"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700">
                                                    <Clock className="size-3.5 text-slate-400" />
                                                    <span>{item.deadline ? format(new Date(item.deadline), "dd MMM yyyy, HH:mm", { locale: localeID }) : "-"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item.file_bukti ? (
                                                    <button
                                                        onClick={() => handleViewFile(item.file_bukti!)}
                                                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                                    >
                                                        <FileText className="size-3" />
                                                        <span>Berkas</span>
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-300 text-xs">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleEditTugasClick(item)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Edit Tugas"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(item.id)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Hapus Tugas"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        /* BOARD VIEW (Bento Cards) */
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedTasks.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-4"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1" title={item.judul_tugas}>
                                                {item.judul_tugas}
                                            </h4>
                                            {getDeadlineBadge(item.deadline)}
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                            {item.deskripsi || "Tidak ada rincian keterangan tugas."}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {item.assignees?.slice(0, 3).map((assignee) => (
                                                <Avatar key={assignee.id} className="size-7 rounded-xl border-2 border-white shadow-sm">
                                                    <AvatarImage src={assignee.foto_path || ''} alt={assignee.nama} />
                                                    <AvatarFallback className="bg-blue-50 text-blue-700 text-[9px] font-bold font-mono">
                                                        {assignee.nama.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {item.file_bukti && (
                                                <button
                                                    onClick={() => handleViewFile(item.file_bukti!)}
                                                    className="size-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-100"
                                                    title="Lihat Berkas"
                                                >
                                                    <FileText className="size-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEditTugasClick(item)}
                                                className="size-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-blue-700 flex items-center justify-center"
                                                title="Edit"
                                            >
                                                <Pencil className="size-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(item.id)}
                                                className="size-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-rose-700 flex items-center justify-center"
                                                title="Hapus"
                                            >
                                                <Trash2 className="size-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-100">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalData={totalData}
                            limit={limit}
                            onLimitChange={handleLimitChange}
                            itemName="tugas"
                        />
                    </div>

                </div>
            </div>

            {/* Modal Tambah/Edit Tugas */}
            <FormTugasModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                tugasData={formModeData}
                onSave={handleSaveTugas}
            />

            {/* Alert Dialog Hapus */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="rounded-3xl border-slate-200">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 font-bold">Hapus Tugas Organisasi?</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-slate-500">
                            Tindakan ini tidak dapat dibatalkan. Tugas ini akan dihapus secara permanen dari basis data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="pt-2">
                        <AlertDialogCancel disabled={isDeleting} className="rounded-full text-xs font-bold">
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Menghapus..." : "Hapus Tugas"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
