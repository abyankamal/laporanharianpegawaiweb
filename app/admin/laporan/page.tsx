"use client"

import { BACKEND_URL } from "@/lib/api-config"
import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import { id as localeID } from "date-fns/locale"
import {
    Calendar as CalendarIcon,
    Download,
    FileText,
    Filter,
    Search,
    Eye,
    Plus,
    FileCheck2,
    Clock,
    UserCheck,
    CheckCircle2,
    AlertCircle,
    Building2,
    Image as ImageIcon,
    ArrowUpDown,
    RotateCcw
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DetailLaporanModal } from "@/components/DetailLaporanModal"
import { CreateReportModal } from "@/components/CreateReportModal"
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { CustomPagination } from "@/components/CustomPagination"

import {
    getRekapLaporan,
    Report,
    downloadReportsPDF,
    downloadAttachments,
    getReportDetail
} from "@/lib/api/reports"
import { getProfile } from "@/lib/api/auth"

export default function LaporanRekapPage() {
    const [startDate, setStartDate] = React.useState<Date | undefined>()
    const [endDate, setEndDate] = React.useState<Date | undefined>()
    const [statusWaktu, setStatusWaktu] = React.useState<string>("semua")
    const [statusReview, setStatusReview] = React.useState<string>("semua")
    const [search, setSearch] = React.useState("")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")
    
    // Modal State
    const [isDetailModalOpen, setDetailModalOpen] = React.useState(false)
    const [isCreateModalOpen, setCreateModalOpen] = React.useState(false)
    const [selectedReport, setSelectedReport] = React.useState<Report | null>(null)
    const [fotoUrl, setFotoUrl] = React.useState<string | null>(null)
    const [dokumenUrl, setDokumenUrl] = React.useState<string | null>(null)
    
    // Data & Pagination
    const [reports, setReports] = React.useState<Report[]>([])
    const [loading, setLoading] = React.useState(false)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [limit, setLimit] = React.useState(10)
    const [totalPages, setTotalPages] = React.useState(1)
    const [totalData, setTotalData] = React.useState(0)
    const [userRole, setUserRole] = React.useState<string | null>(null)

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setCurrentPage(1)
    }

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setCurrentPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [search])

    // Initial Profile Check
    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profRes = await getProfile()
                if (profRes.status === "success") setUserRole(profRes.data.role)
            } catch (error) {
                console.error("Error fetching profile:", error)
            }
        }
        fetchProfile()
    }, [])

    const fetchReports = React.useCallback(async () => {
        setLoading(true)
        try {
            const response = await getRekapLaporan({
                start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
                end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
                status_waktu: statusWaktu === "semua" ? undefined : statusWaktu,
                status_review: statusReview === "semua" ? undefined : statusReview,
                search: debouncedSearch,
                page: currentPage,
                limit
            })

            if (response.success) {
                setReports(response.data || [])
                setTotalPages(response.pagination?.total_pages || 1)
                setTotalData(response.pagination?.total_data || 0)
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
            console.error("Error fetching reports:", error)
        } finally {
            setLoading(false)
        }
    }, [startDate, endDate, statusWaktu, statusReview, debouncedSearch, currentPage, limit])

    React.useEffect(() => {
        fetchReports()
    }, [fetchReports])

    const handleViewDetail = async (report: Report) => {
        try {
            const fullReport = await getReportDetail(report.id)
            setSelectedReport(fullReport)

            const sanitizeUrl = (path: string | undefined | null) => {
                if (!path || path.trim() === "" || path === "null") return null
                if (path.startsWith("http")) return path
                return `${BACKEND_URL}/${path.replace(/\\/g, '/').startsWith('/') ? path.replace(/\\/g, '/').slice(1) : path.replace(/\\/g, '/')}`
            }

            setFotoUrl(sanitizeUrl(fullReport.foto_path))
            setDokumenUrl(sanitizeUrl(fullReport.dokumen_path))
            setDetailModalOpen(true)
        } catch (error) {
            console.error("Gagal mengambil detail laporan:", error)
            setSelectedReport(report)

            const sanitizeUrl = (path: string | undefined | null) => {
                if (!path || path.trim() === "" || path === "null") return null
                if (path.startsWith("http")) return path
                return `${BACKEND_URL}/${path.replace(/\\/g, '/').startsWith('/') ? path.replace(/\\/g, '/').slice(1) : path.replace(/\\/g, '/')}`
            }

            setFotoUrl(sanitizeUrl(report.foto_path))
            setDokumenUrl(sanitizeUrl(report.dokumen_path))
            setDetailModalOpen(true)
        }
    }

    const resetFilters = () => {
        setStartDate(undefined)
        setEndDate(undefined)
        setStatusWaktu("semua")
        setStatusReview("semua")
        setSearch("")
        setCurrentPage(1)
    }

    const getInitials = (name: string) => {
        if (!name) return "??"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
    }

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-1 sm:p-2 selection:bg-blue-600 selection:text-white">
            
            {/* Header: Eyebrow + Executive Title + Action Islands */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                        <Building2 className="size-3.5 text-slate-500" />
                        <span>Arsip & Akuntabilitas ASN</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">Kelurahan Sukanegla</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Rekap Laporan Kinerja
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Data riwayat pelaporan kegiatan kerja harian, dokumentasi lampiran, dan hasil evaluasi atasan langsung.
                    </p>
                </div>

                {/* Island Actions (Button-in-Button Pattern) */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        onClick={() => downloadReportsPDF({
                            start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
                            end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined
                        })}
                        className="group inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-xs font-bold text-slate-700 hover:text-slate-900 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    >
                        <span>Ekspor PDF</span>
                        <div className="size-6 rounded-full bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                            <FileText className="size-3.5" />
                        </div>
                    </button>

                    <button
                        onClick={() => downloadAttachments({
                            start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
                            end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined
                        })}
                        className="group inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-xs font-bold text-slate-700 hover:text-slate-900 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    >
                        <span>Unduh Berkas</span>
                        <div className="size-6 rounded-full bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                            <Download className="size-3.5" />
                        </div>
                    </button>

                    {userRole === "lurah" && (
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
                        >
                            <span>Buat Laporan</span>
                            <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:rotate-90 group-hover:bg-white/25">
                                <Plus className="size-3.5" />
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Island (Double-Bezel Hardware Shell) */}
            <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                <div className="rounded-[calc(2rem-0.375rem)] bg-white p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter className="size-4 text-blue-700" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                Filter & Pencarian Laporan
                            </h3>
                        </div>
                        {(startDate || endDate || statusWaktu !== "semua" || statusReview !== "semua" || search) && (
                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                            >
                                <RotateCcw className="size-3.5" />
                                <span>Reset Filter</span>
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 1. Tanggal Mulai */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-600 block">Tanggal Mulai</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-11 rounded-xl bg-slate-50/60 border-slate-200 text-xs",
                                            !startDate && "text-slate-400"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 size-3.5 text-slate-500" />
                                        {startDate ? format(startDate, "dd MMM yyyy", { locale: localeID }) : <span>Pilih Tanggal Mulai</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => {
                                            setStartDate(date)
                                            setCurrentPage(1)
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* 2. Tanggal Akhir */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-600 block">Tanggal Akhir</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal h-11 rounded-xl bg-slate-50/60 border-slate-200 text-xs",
                                            !endDate && "text-slate-400"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 size-3.5 text-slate-500" />
                                        {endDate ? format(endDate, "dd MMM yyyy", { locale: localeID }) : <span>Pilih Tanggal Selesai</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={(date) => {
                                            setEndDate(date)
                                            setCurrentPage(1)
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* 3. Status Waktu */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-600 block">Ketepatan Waktu</label>
                            <Select value={statusWaktu} onValueChange={(val) => {
                                setStatusWaktu(val)
                                setCurrentPage(1)
                            }}>
                                <SelectTrigger className="h-11 rounded-xl bg-slate-50/60 border-slate-200 text-xs">
                                    <SelectValue placeholder="Semua Status Waktu" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="semua">Semua Waktu</SelectItem>
                                    <SelectItem value="tepat">Tepat Waktu (Sesuai Jam)</SelectItem>
                                    <SelectItem value="lembur">Lembur (Luar Jam Kerja)</SelectItem>
                                    <SelectItem value="libur">Lembur Hari Libur</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* 4. Cari Nama / Uraian */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-600 block">Cari Pegawai / Uraian</label>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                <Input
                                    placeholder="Ketik nama atau kata kunci..."
                                    className="pl-10 h-11 rounded-xl bg-slate-50/60 border-slate-200 text-xs"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Main Table: Double-Bezel Hardware Architecture */}
            <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                <div className="rounded-[calc(2rem-0.5rem)] bg-white overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                    
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                <TableRow>
                                    <TableHead className="w-12 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">NO</TableHead>
                                    <TableHead className="min-w-[130px] text-[11px] font-bold uppercase tracking-wider text-slate-500">TANGGAL & WAKTU</TableHead>
                                    <TableHead className="min-w-[200px] text-[11px] font-bold uppercase tracking-wider text-slate-500">PEGAWAI</TableHead>
                                    <TableHead className="min-w-[280px] text-[11px] font-bold uppercase tracking-wider text-slate-500">URAIAN HASIL KERJA</TableHead>
                                    <TableHead className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">STATUS WAKTU</TableHead>
                                    <TableHead className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">EVALUASI ATASAN</TableHead>
                                    <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">RINCIAN</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-100">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
                                                <span className="text-xs font-semibold text-slate-500">Memuat arsip laporan...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : reports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-slate-400">
                                            <div className="space-y-1">
                                                <FileCheck2 className="size-6 mx-auto opacity-30" />
                                                <p className="text-xs font-medium">Tidak ada data laporan yang sesuai kriteria.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.map((item, index) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            {/* No */}
                                            <TableCell className="text-center text-xs font-mono text-slate-400">
                                                {(currentPage - 1) * limit + index + 1}
                                            </TableCell>

                                            {/* Tanggal & Waktu */}
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-900">{item.tanggal}</span>
                                                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                                                        <Clock className="size-3" />
                                                        {item.jam_lapor} WIB
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Pegawai */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 font-mono shrink-0">
                                                        {getInitials(item.nama)}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <span className="text-xs font-bold text-slate-900 block truncate">{item.nama}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                                                            {item.jabatan}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Uraian Hasil Kerja & Lampiran */}
                                            <TableCell>
                                                <div className="space-y-1 max-w-[320px]">
                                                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-medium">
                                                        {item.laporan}
                                                    </p>
                                                    {(item.foto_path || item.dokumen_path) && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                            <ImageIcon className="size-2.5" />
                                                            <span>Ada Lampiran</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Status Waktu */}
                                            <TableCell className="text-center">
                                                {item.status_waktu === "Tepat Waktu" ? (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                                                        Tepat Waktu
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 inline-block">
                                                        {item.status_waktu}
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Status Review */}
                                            <TableCell className="text-center">
                                                {item.status_review === "Disetujui" ? (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-block">
                                                        Disetujui
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 inline-block">
                                                        {item.status_review || "Menunggu"}
                                                    </span>
                                                )}
                                            </TableCell>

                                            {/* Rincian Action */}
                                            <TableCell className="text-right">
                                                <button
                                                    onClick={() => handleViewDetail(item)}
                                                    className="size-8 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                    title="Lihat Detail Laporan"
                                                >
                                                    <Eye className="size-4" />
                                                </button>
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
                            itemName="laporan"
                        />
                    </div>

                </div>
            </div>

            {/* Modal Detail & Modal Buat */}
            <DetailLaporanModal
                isOpen={isDetailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                report={selectedReport}
                fotoUrl={fotoUrl}
                dokumenUrl={dokumenUrl}
                role={userRole}
                onSuccess={fetchReports}
            />

            {userRole === "lurah" && (
                <CreateReportModal 
                    isOpen={isCreateModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onSuccess={fetchReports}
                />
            )}
        </div>
    )
}
