"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    Calendar as CalendarIcon,
    Download,
    FileText,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DetailLaporanModal } from "@/components/DetailLaporanModal"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export default function LaporanRekapPage() {
    const [startDate, setStartDate] = React.useState<Date>()
    const [endDate, setEndDate] = React.useState<Date>()
    const [status, setStatus] = React.useState<string>("semua")
    const [search, setSearch] = React.useState("")
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [selectedLaporan, setSelectedLaporan] = React.useState<any>(null)

    const handleViewDetail = (item: any) => {
        setSelectedLaporan({
            ...item,
            nip: `19920815201903${item.id}001`,
            fotoUrl: "https://images.unsplash.com/photo-1573163231162-717dfc3e4146?q=80&w=800",
            deskripsi: item.laporan
        })
        setIsDetailOpen(true)
    }

    const laporanData = [
        {
            id: 1,
            tanggal: "2024-03-07",
            nama: "Ahmad Fulan",
            jabatan: "Kasi Pem",
            laporan: "Monitoring pelaksanaan Posyandu di RW 04 dan pendataan warga baru.",
            jamLapor: "08:15",
            statusWaktu: "Tepat Waktu",
            statusReview: "Disetujui"
        },
        {
            id: 2,
            tanggal: "2024-03-07",
            nama: "Siti Aminah",
            jabatan: "Staf Kesra",
            laporan: "Penyusunan berkas bantuan sosial modal usaha untuk UMKM tingkat desa.",
            jamLapor: "17:30",
            statusWaktu: "Lembur",
            statusReview: "Pending"
        },
        {
            id: 3,
            tanggal: "2024-03-06",
            nama: "Budi Santoso",
            jabatan: "Kaur Umum",
            laporan: "Pemeliharaan inventaris kantor dan perbaikan jaringan internet balai desa.",
            jamLapor: "08:05",
            statusWaktu: "Tepat Waktu",
            statusReview: "Disetujui"
        }
    ]

    return (
        <div className="flex flex-col gap-6 p-1">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Rekap Laporan Kinerja</h1>
                    <p className="text-muted-foreground text-sm">
                        Lihat dan kelola rangkuman laporan kerja seluruh pegawai.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <FileText className="size-4" />
                        <span className="hidden sm:inline">Export PDF</span>
                        <span className="sm:hidden">PDF</span>
                    </Button>
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                        <Download className="size-4" />
                        <span className="hidden sm:inline">Export to Excel</span>
                        <span className="sm:hidden">Excel</span>
                    </Button>
                </div>
            </div>

            {/* Card Filter Pencarian */}
            <Card className="shadow-sm border-muted-foreground/10">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Filter className="size-4 text-primary" />
                        Filter Pencarian
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tanggal Mulai</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-10",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP") : <span>mm/dd/yyyy</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tanggal Akhir</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-10",
                                            !endDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP") : <span>mm/dd/yyyy</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status Waktu</label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Pilih Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua</SelectItem>
                                    <SelectItem value="tepat">Tepat Waktu</SelectItem>
                                    <SelectItem value="lembur">Lembur</SelectItem>
                                    <SelectItem value="libur">Lembur (Hari Libur)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cari Pegawai</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Nama atau Jabatan..."
                                    className="pl-9 h-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button variant="secondary" className="px-6 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
                            Terapkan Filter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Card Tabel Data */}
            <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-12 text-center">NO</TableHead>
                                    <TableHead className="min-w-[100px]">TANGGAL</TableHead>
                                    <TableHead className="min-w-[180px]">NAMA PEGAWAI</TableHead>
                                    <TableHead className="min-w-[250px]">LAPORAN TUGAS</TableHead>
                                    <TableHead className="text-center">JAM LAPOR</TableHead>
                                    <TableHead className="text-center">STATUS WAKTU</TableHead>
                                    <TableHead className="text-center">STATUS REVIEW</TableHead>
                                    <TableHead className="text-right">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {laporanData.map((item, index) => (
                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                                        <TableCell className="text-sm">{item.tanggal}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{item.nama}</span>
                                                <span className="text-xs text-muted-foreground">{item.jabatan}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm line-clamp-2 max-w-[300px] text-muted-foreground">
                                                {item.laporan}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-center text-sm font-medium">
                                            {item.jamLapor}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "px-2.5 py-0.5 font-medium rounded-full border-transparent",
                                                    item.statusWaktu === "Tepat Waktu"
                                                        ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400"
                                                )}
                                            >
                                                {item.statusWaktu}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "px-2.5 py-0.5 font-medium rounded-full border-transparent",
                                                    item.statusReview === "Disetujui"
                                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                                                        : "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                                                )}
                                            >
                                                {item.statusReview}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => handleViewDetail(item)}
                                            >
                                                <Eye className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
                    <p className="text-xs text-muted-foreground order-2 sm:order-1">
                        Menampilkan <span className="font-medium text-foreground">1-10</span> dari <span className="font-medium text-foreground">150</span> data
                    </p>
                    <div className="flex items-center gap-1 order-1 sm:order-2">
                        <Button variant="outline" size="icon" className="size-8">
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button variant="default" size="sm" className="size-8 p-0 text-xs">1</Button>
                        <Button variant="outline" size="sm" className="size-8 p-0 text-xs">2</Button>
                        <Button variant="outline" size="sm" className="size-8 p-0 text-xs">3</Button>
                        <Button variant="outline" size="icon" className="size-8">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            <DetailLaporanModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                data={selectedLaporan}
            />
        </div>
    )
}
