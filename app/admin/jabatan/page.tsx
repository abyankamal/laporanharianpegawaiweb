"use client"

import * as React from "react"
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Briefcase
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { FormJabatanModal } from "@/components/FormJabatanModal"

import {
    getJabatans,
    deleteJabatan,
    createJabatan,
    updateJabatan,
    Jabatan
} from "@/lib/api/jabatan"

import { toast } from "sonner"

export default function ManajemenJabatanPage() {

    const [loading, setLoading] = React.useState(true)
    const [jabatans, setJabatans] = React.useState<Jabatan[]>([])
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [selectedJabatan, setSelectedJabatan] = React.useState<Jabatan | null>(null)
    const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
    const [formModeData, setFormModeData] = React.useState<Jabatan | null>(null)

    const fetchJabatans = React.useCallback(async () => {
        setLoading(true)
        try {
            const response = await getJabatans()
            if (response.success) {
                setJabatans(response.data)
            }
        } catch (error) {
            console.error("Error fetching jabatans:", error)
            toast.error("Gagal mengambil data jabatan")
        } finally {
            setLoading(false)
        }
    }, [toast])

    React.useEffect(() => {
        fetchJabatans()
    }, [fetchJabatans])

    const filteredJabatans = jabatans.filter(j =>
        j.nama.toLowerCase().includes(searchTerm.toLowerCase())
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
        } catch (error) {
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
        } catch (error) {
            toast.error("Gagal menyimpan data")
        }
    }

    return (
        <div className="flex flex-col gap-6 p-1">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Jabatan</h1>
                    <p className="text-muted-foreground text-sm">
                        Kelola daftar jabatan yang tersedia di organisasi.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex items-center w-full sm:w-72 md:w-80 h-10 border border-input rounded-lg bg-background px-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <Search className="size-4 text-muted-foreground shrink-0" />
                        <input
                            className="flex h-full w-full bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground"
                            placeholder="Cari nama jabatan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        className="w-full sm:w-auto h-10 flex items-center gap-2 shrink-0 bg-blue-600 hover:bg-blue-700"
                        onClick={handleAddClick}
                    >
                        <Plus className="size-4" />
                        <span>Tambah Jabatan</span>
                    </Button>
                </div>
            </div>

            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[100px]">NO</TableHead>
                                <TableHead>NAMA JABATAN</TableHead>
                                <TableHead className="text-right">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-10">
                                        Memuat data...
                                    </TableCell>
                                </TableRow>
                            ) : filteredJabatans.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-10">
                                        Tidak ada data jabatan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredJabatans.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium text-sm text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell className="font-semibold text-sm">
                                            {item.nama}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleEditClick(item)}
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
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
            </Card>

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedJabatan?.nama || ""}
            />

            <FormJabatanModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                jabatanData={formModeData}
                onSave={handleSave}
            />
        </div>
    )
}
