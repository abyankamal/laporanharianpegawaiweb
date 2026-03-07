"use client"

import * as React from "react"
import {
    Search,
    Plus,
    Pencil,
    Eye,
    ChevronLeft,
    ChevronRight
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { FormTugasModal, TugasData } from "@/components/FormTugasModal"

// Dummy data
const tugasData = [
    {
        id: 1,
        namaTugas: "Audit Tahunan Divisi IT",
        project: "Project: Infrastruktur 2026",
        prioritas: "HIGH",
        penanggungJawab: "Budi Santoso",
        foto: "BS",
        deadline: "12 Okt 2026",
        status: "Sedang Dikerjakan"
    },
    {
        id: 2,
        namaTugas: "Desain UI/UX Dashboard Admin",
        project: "Project: SIOPIK V2",
        prioritas: "MEDIUM",
        penanggungJawab: "Siti Aminah",
        foto: "SA",
        deadline: "15 Okt 2026",
        status: "Selesai"
    },
    {
        id: 3,
        namaTugas: "Migrasi Database Pelanggan",
        project: "Project: Cloud Migration",
        prioritas: "HIGH",
        penanggungJawab: "Ahmad Riyadi",
        foto: "AR",
        deadline: "20 Okt 2026",
        status: "Belum Dimulai"
    },
    {
        id: 4,
        namaTugas: "Penyusunan Laporan Kuartal 3",
        project: "Project: Finance & Reporting",
        prioritas: "LOW",
        penanggungJawab: "Dewi Lestari",
        foto: "DL",
        deadline: "25 Okt 2026",
        status: "Sedang Dikerjakan"
    }
]

export default function PemantauanTugasPage() {
    const [search, setSearch] = React.useState("")
    const [status, setStatus] = React.useState("semua")
    const [prioritas, setPrioritas] = React.useState("semua")

    // Modal State
    const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
    const [formModeData, setFormModeData] = React.useState<TugasData | null>(null)

    const handleAddTugasClick = () => {
        setFormModeData(null) // mode Tambah
        setIsFormModalOpen(true)
    }

    const handleEditTugasClick = (item: any) => {
        setFormModeData({
            id: item.id,
            namaTugas: item.namaTugas,
            project: item.project,
            deskripsi: "Deskripsi dummy untuk " + item.namaTugas, // missing from table data, mocked
            penanggungJawab: item.penanggungJawab,
            prioritas: item.prioritas,
            deadline: item.deadline,
            status: item.status
        })
        setIsFormModalOpen(true)
    }

    const handleSaveTugas = (data: any) => {
        console.log("Menyimpan data tugas:", data)
        setIsFormModalOpen(false)
    }

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

            {/* Card Filter Pencarian */}
            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col xl:flex-row gap-4 items-end">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            {/* Kolom 1 (Cari Tugas) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Cari Tugas
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Masukkan nama tugas..."
                                        className="pl-9 h-10 w-full"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Kolom 2 (Status) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Status
                                </label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-10 w-full">
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="semua">Semua Status</SelectItem>
                                        <SelectItem value="Sedang Dikerjakan">Sedang Dikerjakan</SelectItem>
                                        <SelectItem value="Selesai">Selesai</SelectItem>
                                        <SelectItem value="Belum Dimulai">Belum Dimulai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kolom 3 (Prioritas) */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Prioritas
                                </label>
                                <Select value={prioritas} onValueChange={setPrioritas}>
                                    <SelectTrigger className="h-10 w-full">
                                        <SelectValue placeholder="Semua Prioritas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="semua">Semua Prioritas</SelectItem>
                                        <SelectItem value="HIGH">HIGH</SelectItem>
                                        <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                                        <SelectItem value="LOW">LOW</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Tombol Terapkan */}
                        <Button className="w-full xl:w-auto h-10 px-8 bg-slate-800 hover:bg-slate-900 text-white shrink-0 mt-4 xl:mt-0">
                            Terapkan
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Card Tabel Data Tugas */}
            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-12 text-center">NO</TableHead>
                                <TableHead className="min-w-[250px]">NAMA TUGAS</TableHead>
                                <TableHead className="min-w-[120px] text-center">PRIORITAS</TableHead>
                                <TableHead className="min-w-[200px]">PENANGGUNG JAWAB</TableHead>
                                <TableHead className="min-w-[140px]">DEADLINE</TableHead>
                                <TableHead className="min-w-[160px]">STATUS</TableHead>
                                <TableHead className="text-right min-w-[100px]">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tugasData.map((item, index) => (
                                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="text-center font-medium">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">
                                                {item.namaTugas}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.project}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            className={cn(
                                                "px-2.5 py-0.5 text-[11px] font-bold rounded-full border-transparent tracking-wide w-fit mx-auto",
                                                item.prioritas === "HIGH" && "bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
                                                item.prioritas === "MEDIUM" && "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
                                                item.prioritas === "LOW" && "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                                            )}
                                        >
                                            {item.prioritas}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-8 border shadow-sm">
                                                <AvatarImage src={`/avatars/${item.id}.png`} alt={item.penanggungJawab} />
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
                                                    {item.foto}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-semibold">
                                                {item.penanggungJawab}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">
                                        {item.deadline}
                                    </TableCell>
                                    <TableCell>
                                        <span className={cn(
                                            "text-sm font-medium",
                                            item.status === "Sedang Dikerjakan" && "text-blue-600 dark:text-blue-400",
                                            item.status === "Selesai" && "text-emerald-600 dark:text-emerald-400",
                                            item.status === "Belum Dimulai" && "text-muted-foreground"
                                        )}>
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                <Eye className="size-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-muted-foreground hover:text-slate-800 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                                                onClick={() => handleEditTugasClick(item)}
                                            >
                                                <Pencil className="size-4" />
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
                        Menampilkan <span className="font-medium text-foreground">1-4</span> dari <span className="font-medium text-foreground">24</span> tugas
                    </p>
                    <div className="flex items-center gap-1 order-1 sm:order-2">
                        <Button variant="outline" size="icon" className="size-8">
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button variant="default" size="sm" className="size-8 p-0 text-xs shadow-sm">1</Button>
                        <Button variant="outline" size="sm" className="size-8 p-0 text-xs">2</Button>
                        <Button variant="outline" size="sm" className="size-8 p-0 text-xs">3</Button>
                        <Button variant="outline" size="icon" className="size-8">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Modal Form Tambah/Edit Tugas */}
            <FormTugasModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                tugasData={formModeData}
                onSave={handleSaveTugas}
            />
        </div>
    )
}
