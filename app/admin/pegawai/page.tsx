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
    UserCheck,
    CalendarDays
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
import { cn } from "@/lib/utils"

import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { FormPegawaiModal, PegawaiData } from "@/components/FormPegawaiModal"

// Dummy data
const pegawaiData = [
    {
        id: 1,
        nama: "Budi Santoso",
        nip: "198501012010011001",
        jabatan: "Kepala Desa",
        status: "Aktif",
        foto: "BS"
    },
    {
        id: 2,
        nama: "Siti Aminah",
        nip: "198802152012122002",
        jabatan: "Sekretaris Desa",
        status: "Cuti",
        foto: "SA"
    },
    {
        id: 3,
        nama: "Ahmad Riyadi",
        nip: "199011202015041003",
        jabatan: "Kaur Keuangan",
        status: "Aktif",
        foto: "AR"
    },
    {
        id: 4,
        nama: "Dewi Lestari",
        nip: "199307082018012004",
        jabatan: "Kasi Kesejahteraan",
        status: "Non-Aktif",
        foto: "DL"
    }
]

export default function ManajemenPegawaiPage() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [selectedPegawai, setSelectedPegawai] = React.useState("")

    // Form Modal States
    const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
    const [formModeData, setFormModeData] = React.useState<PegawaiData | null>(null)

    const handleAddPegawaiClick = () => {
        setFormModeData(null) // null indicates Add Mode
        setIsFormModalOpen(true)
    }

    const handleEditPegawaiClick = (item: any) => {
        setFormModeData({
            id: item.id,
            nip: item.nip,
            nama: item.nama,
            jabatan: item.jabatan,
            role: "Pegawai", // Default role for dummy data mapping
            status: item.status
        })
        setIsFormModalOpen(true)
    }

    const handleSavePegawai = (data: any) => {
        console.log("Menyimpan data pegawai:", data)
        setIsFormModalOpen(false)
    }

    const handleDeleteClick = (nama: string) => {
        setSelectedPegawai(nama)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = () => {
        // Implementasi logika penghapusan di sini
        console.log(`Menghapus pegawai: ${selectedPegawai}`)
        setIsDeleteModalOpen(false)
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
                        <div className="relative w-full sm:w-72 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama, NIP, atau jabatan..."
                                className="pl-9 h-10 w-full"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="size-10 shrink-0 sm:hidden">
                            <Filter className="size-4" />
                        </Button>
                        <Button variant="outline" className="h-10 hidden sm:flex items-center gap-2 shrink-0">
                            <Filter className="size-4" />
                            <span>Filter</span>
                        </Button>
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
                                <TableHead className="text-center min-w-[120px]">STATUS</TableHead>
                                <TableHead className="text-right min-w-[100px]">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pegawaiData.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-center">
                                        <Avatar className="size-8 mx-auto border-2 border-background shadow-sm">
                                            <AvatarImage src={`/avatars/${item.id}.png`} alt={item.nama} />
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                {item.foto}
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
                                        {item.jabatan}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "px-2.5 py-0.5 font-medium rounded-full border-transparent flex items-center justify-center gap-1.5 w-max mx-auto",
                                                item.status === "Aktif" && "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                                                item.status === "Cuti" && "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
                                                item.status === "Non-Aktif" && "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                                            )}
                                        >
                                            {item.status === "Aktif" && <span className="size-1.5 rounded-full bg-green-600" />}
                                            {item.status}
                                        </Badge>
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
                                                onClick={() => handleDeleteClick(item.nama)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
                    <p className="text-xs text-muted-foreground order-2 sm:order-1">
                        Menampilkan <span className="font-medium text-foreground">1</span> sampai <span className="font-medium text-foreground">4</span> dari <span className="font-medium text-foreground">24</span> entri
                    </p>
                    <div className="flex items-center gap-1 order-1 sm:order-2">
                        <Button variant="outline" size="icon" className="size-8">
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button variant="default" size="sm" className="size-8 p-0 text-xs shadow-sm">1</Button>
                        <Button variant="outline" size="sm" className="size-8 p-0 text-xs">2</Button>
                        <Button variant="outline" size="sm" className="size-8 p-0 text-xs">3</Button>
                        <Button variant="ghost" size="icon" className="size-8 cursor-default hover:bg-transparent">
                            <span className="text-muted-foreground">...</span>
                        </Button>
                        <Button variant="outline" size="sm" className="size-8 p-0 text-xs">6</Button>
                        <Button variant="outline" size="icon" className="size-8">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Kartu Statistik (Widget Bawah) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                <Card className="shadow-sm border-muted-foreground/10">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Total Pegawai</span>
                            <span className="text-2xl font-bold">24 <span className="text-sm font-semibold text-muted-foreground">Orang</span></span>
                        </div>
                        <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Users className="size-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted-foreground/10">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Pegawai Aktif</span>
                            <span className="text-2xl font-bold">21 <span className="text-sm font-semibold text-muted-foreground">Orang</span></span>
                        </div>
                        <div className="size-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                            <UserCheck className="size-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-muted-foreground/10">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Izin / Cuti</span>
                            <span className="text-2xl font-bold">3 <span className="text-sm font-semibold text-muted-foreground">Orang</span></span>
                        </div>
                        <div className="size-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <CalendarDays className="size-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Integasi Modal Hapus */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedPegawai}
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
