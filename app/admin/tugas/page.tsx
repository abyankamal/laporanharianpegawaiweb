"use client"

import { BACKEND_URL } from "@/lib/api-config"

import * as React from "react"
import { format } from "date-fns"
import {
    Plus,
    Pencil,
    Eye,
    ChevronLeft,
    ChevronRight,
    Trash2,
    FileText,
    ExternalLink
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
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
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
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [totalData, setTotalData] = React.useState(0)
    const [limit] = React.useState(10)

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
                setTasks(response.data)
                setTotalData(response.data.length)
                setTotalPages(Math.ceil(response.data.length / limit))
            } else {
                setError(response.message || "Gagal mengambil data tugas")
            }
        } catch (err) {
            console.error("Error fetching tasks:", err)
            setError("Terjadi kesalahan saat menghubungi server")
        } finally {
            setLoading(false)
        }
    }, [])

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
                    toast.success("Tugas Berhasil Diperbarui")
                }
            } else {
                const res = await createTask(formData)
                if (res.success) {
                    toast.success("Tugas Berhasil Ditambahkan")
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
                toast.success("Tugas Berhasil Dihapus")
                fetchTasks()
            } else {
                toast.error(response.message || "Gagal menghapus tugas")
            }
        } catch (err) {
            console.error("Error deleting task:", err)
            toast.error("Gagal menghapus tugas")
        } finally {
            setIsDeleting(false)
            setDeleteId(null)
        }
    }

    const handleViewFile = (filePath: string) => {
        // Adjust based on how your backend serves files
        // If server serves with /api prefix as seen in main.go
        const fullUrl = `${BACKEND_URL}/${filePath.replace(/^\//, '')}`
        window.open(fullUrl, '_blank')
    }

    const paginatedTasks = tasks.slice(
        (currentPage - 1) * limit,
        currentPage * limit
    )

    return (
        <div className="flex flex-col gap-6 p-1">
            {/* Header Halaman & Tombol Aksi */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Pemantauan Tugas</h1>
                    <p className="text-muted-foreground text-sm">
                        Kelola dan pantau progres tugas tim Anda secara real-time
                    </p>
                </div>
                <Button
                    className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm shrink-0 text-white"
                    onClick={handleAddTugasClick}
                >
                    <Plus className="size-4" />
                    <span>Tambah Tugas</span>
                </Button>
            </div>

            {/* Card Tabel Data Tugas */}
            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-12 text-center">NO</TableHead>
                                <TableHead className="min-w-[250px]">JUDUL TUGAS</TableHead>
                                <TableHead className="min-w-[200px]">PENANGGUNG JAWAB</TableHead>
                                <TableHead className="min-w-[140px]">DEADLINE</TableHead>
                                <TableHead className="min-w-[140px] text-center">FILE</TableHead>
                                <TableHead className="text-right min-w-[120px]">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        Memuat data tugas...
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-red-500">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : tasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        Belum ada tugas organisasi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedTasks.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="text-center font-medium">
                                            {(currentPage - 1) * limit + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-foreground">
                                                    {item.judul_tugas}
                                                </span>
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {item.deskripsi || "Tidak ada deskripsi"}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex -space-x-3 overflow-hidden">
                                                {item.assignees?.slice(0, 3).map((assignee) => (
                                                    <Avatar key={assignee.id} className="size-8 border-2 border-background shadow-sm hover:z-10 transition-all">
                                                        <AvatarImage src={assignee.foto_path || ''} alt={assignee.nama} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-600 text-[10px] font-bold">
                                                            {assignee.nama.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ))}
                                                {item.assignees && item.assignees.length > 3 && (
                                                    <div className="flex items-center justify-center size-8 rounded-full border-2 border-background bg-slate-100 text-[10px] font-bold text-slate-600 z-0">
                                                        +{item.assignees.length - 3}
                                                    </div>
                                                )}
                                                {(!item.assignees || item.assignees.length === 0) && (
                                                    <span className="text-xs text-muted-foreground">Belum di-assign</span>
                                                )}
                                            </div>
                                            {item.assignees && item.assignees.length > 0 && (
                                                <p className="text-[10px] mt-1 text-muted-foreground font-medium">
                                                    {item.assignees[0].nama} {item.assignees.length > 1 ? `& ${item.assignees.length - 1} lainnya` : ''}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">
                                            {item.deadline ? format(new Date(item.deadline), "dd MMM yyyy, HH:mm") : "-"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.file_bukti ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleViewFile(item.file_bukti!)}
                                                >
                                                    <FileText className="size-4" />
                                                    <span className="text-xs font-semibold">Tinjau</span>
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                                                    onClick={() => handleEditTugasClick(item)}
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDeleteClick(item.id)}
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
                    totalData={totalData}
                    limit={limit}
                    itemName="tugas"
                />
            </Card>

            {/* Modal Form Tambah/Edit Tugas */}
            <FormTugasModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                tugasData={formModeData}
                onSave={handleSaveTugas}
            />

            {/* Alert Dialog Hapus */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Tugas?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Tugas ini akan dihapus secara permanen dari server.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
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
