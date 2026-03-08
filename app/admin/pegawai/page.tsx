"use client"

import * as React from "react"
import {
    Search,
    Filter,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Users,
    Check
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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { FormPegawaiModal, PegawaiData } from "@/components/FormPegawaiModal"

import {
    getEmployees,
    deleteEmployee,
    createEmployee,
    updateEmployee,
    Employee
} from "@/lib/api/employees"
import { toast } from "sonner"

export default function ManajemenPegawaiPage() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [selectedPegawai, setSelectedPegawai] = React.useState<Employee | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [totalData, setTotalData] = React.useState(0)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [limit] = React.useState(10)

    // Form Modal States
    const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
    const [formModeData, setFormModeData] = React.useState<any | null>(null)

    const [selectedRole, setSelectedRole] = React.useState<string>("Semua")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const fetchEmployees = React.useCallback(async () => {
        setLoading(true)
        try {
            const roleValue = selectedRole === "Sekretaris" ? "sekertaris" : selectedRole.toLowerCase()
            const response = await getEmployees({
                search: debouncedSearch,
                role: selectedRole === "Semua" ? "" : roleValue,
                page: currentPage,
                limit
            })
            // Support both 'success' boolean and 'status === "success"'
            const isSuccess = response.success || (response as any).status === "success"

            if (isSuccess && response.data) {
                setEmployees(response.data.list || [])
                setTotalData(response.data.pagination?.total_data || 0)
                setTotalPages(response.data.pagination?.total_pages || 1)
            }
        } catch (error) {
            console.error("Error fetching employees:", error)
            toast.error("Gagal mengambil data pegawai")
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, selectedRole, currentPage, limit, toast])

    React.useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleAddPegawaiClick = () => {
        setFormModeData(null)
        setIsFormModalOpen(true)
    }

    const handleEditPegawaiClick = (item: Employee) => {
        setFormModeData({
            id: item.id,
            nip: item.nip,
            nama: item.nama,
            jabatan: item.jabatan?.nama_jabatan || "",
            jabatan_id: item.jabatan_id,
            role: item.role,
        })
        setIsFormModalOpen(true)
    }

    const handleSavePegawai = async (data: any) => {
        try {
            // Map frontend data to backend structure
            // Backend expects 'role' and 'jabatan_id' (uint)
            const payload = {
                nip: data.nip,
                nama: data.nama,
                role: data.role.toLowerCase(),
                jabatan_id: data.jabatan_id ? Number(data.jabatan_id) : undefined,
                password: data.password || undefined
            }

            if (data.id) {
                await updateEmployee(data.id, payload)
                toast.success("Data pegawai berhasil diperbarui")
            } else {
                await createEmployee(payload)
                toast.success("Pegawai baru berhasil ditambahkan")
            }
            setIsFormModalOpen(false)
            fetchEmployees()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal menyimpan data pegawai")
        }
    }

    const handleDeleteClick = (pegawai: Employee) => {
        setSelectedPegawai(pegawai)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedPegawai) return
        try {
            await deleteEmployee(selectedPegawai.id)
            toast.success("Data pegawai berhasil dihapus")
            setIsDeleteModalOpen(false)
            fetchEmployees()
        } catch (error) {
            toast.error("Gagal menghapus data pegawai")
        }
    }

    return (
        <div className="flex flex-col gap-6 p-1">
            {/* Header & Baris Aksi */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Pegawai</h1>
                    <p className="text-muted-foreground text-sm">
                        Kelola data, struktur organisasi, dan status kepegawaian perangkat desa SIOPIK.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex items-center w-full sm:w-72 md:w-80 h-10 border border-input rounded-lg bg-background px-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                            <Search className="size-4 text-muted-foreground shrink-0" />
                            <input
                                className="flex h-full w-full bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground"
                                placeholder="Cari nama, NIP, atau jabatan..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-10 flex items-center gap-2 shrink-0">
                                    <Filter className="size-4" />
                                    <span>{selectedRole === "Semua" ? "Filter Role" : selectedRole}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Filter berdasarkan Role</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {["Semua", "Lurah", "Sekertaris", "Kasi", "Staf"].map((role) => (
                                    <DropdownMenuCheckboxItem
                                        key={role}
                                        checked={selectedRole === (role === "Sekertaris" ? "Sekretaris" : role)}
                                        onCheckedChange={() => {
                                            setSelectedRole(role === "Sekertaris" ? "Sekretaris" : role)
                                            setCurrentPage(1)
                                        }}
                                    >
                                        {role === "Sekertaris" ? "Sekretaris" : role}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Button
                        className="w-full sm:w-auto h-10 flex items-center gap-2 shrink-0 bg-blue-600 hover:bg-blue-700"
                        onClick={handleAddPegawaiClick}
                    >
                        <Plus className="size-4" />
                        <span>Tambah Pegawai</span>
                    </Button>
                </div>
            </div>

            {/* Tabel Data Pegawai */}
            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[80px] text-center">FOTO</TableHead>
                                <TableHead className="min-w-[200px]">NAMA LENGKAP</TableHead>
                                <TableHead className="min-w-[180px]">NIP</TableHead>
                                <TableHead className="min-w-[180px]">JABATAN</TableHead>
                                <TableHead className="text-right min-w-[100px]">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        Memuat data...
                                    </TableCell>
                                </TableRow>
                            ) : (employees?.length || 0) === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        Tidak ada data pegawai.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                employees?.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="text-center">
                                            <Avatar className="size-8 mx-auto border-2 border-background shadow-sm">
                                                <AvatarImage src={item.foto_path ? `/${item.foto_path}` : ""} alt={item.nama} />
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                    {item.nama.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="font-semibold text-sm">
                                            {item.nama}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-muted-foreground">
                                            {item.nip}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {item.jabatan?.nama_jabatan || "-"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleEditPegawaiClick(item)}
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
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
                    <p className="text-xs text-muted-foreground order-2 sm:order-1">
                        Menampilkan <span className="font-medium text-foreground">{employees.length > 0 ? (currentPage - 1) * limit + 1 : 0}</span> sampai <span className="font-medium text-foreground">{Math.min(currentPage * limit, totalData)}</span> dari <span className="font-medium text-foreground">{totalData}</span> entri
                    </p>
                    <div className="flex items-center gap-1 order-1 sm:order-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Button
                                    key={p}
                                    variant={currentPage === p ? "default" : "outline"}
                                    size="sm"
                                    className="size-8 p-0 text-xs shadow-sm"
                                    onClick={() => setCurrentPage(p)}
                                >
                                    {p}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Integasi Modal Hapus */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedPegawai?.nama || ""}
            />

            {/* Modal Form Tambah/Edit Pegawai */}
            <FormPegawaiModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                pegawaiData={formModeData}
                onSave={handleSavePegawai}
            />
        </div>
    )
}
