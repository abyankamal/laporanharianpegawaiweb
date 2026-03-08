"use client"

import * as React from "react"
import { format } from "date-fns"
import {
    Calendar as CalendarIcon,
    Download,
    FileText,
    Filter,
    Search,
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
import { CustomPagination } from "@/components/CustomPagination"

import { getRekapLaporan, Report, downloadReportsPDF, downloadReportsExcel, getReportDetail, downloadAttachments } from "@/lib/api/reports"
import { getProfile } from "@/lib/api/auth"
import { getWorkHour, getHolidays, WorkHour, Holiday } from "@/lib/api/settings"
import { isWithinInterval, parse, isFriday, isSaturday, isSunday } from "date-fns"

export default function LaporanRekapPage() {
    const [startDate, setStartDate] = React.useState<Date>()
    const [endDate, setEndDate] = React.useState<Date>()
    const [statusWaktu, setStatusWaktu] = React.useState<string>("semua")
    const [statusReview, setStatusReview] = React.useState<string>("semua")
    const [search, setSearch] = React.useState("")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")
    const [isDetailModalOpen, setDetailModalOpen] = React.useState(false)
    const [selectedReport, setSelectedReport] = React.useState<Report | null>(null)
    const [fotoUrl, setFotoUrl] = React.useState<string | null>(null)
    const [dokumenUrl, setDokumenUrl] = React.useState<string | null>(null)
    const [reports, setReports] = React.useState<Report[]>([])
    const [loading, setLoading] = React.useState(false)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [totalData, setTotalData] = React.useState(0)
    const [workHour, setWorkHour] = React.useState<WorkHour | null>(null)
    const [holidays, setHolidays] = React.useState<Holiday[]>([])
    const [userRole, setUserRole] = React.useState<string | null>(null)
    const limit = 10

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setCurrentPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    // Initial fetch for settings
    React.useEffect(() => {
        const fetchSettingsAndProfile = async () => {
            try {
                const [whRes, hRes, profRes] = await Promise.all([
                    getWorkHour(),
                    getHolidays(),
                    getProfile()
                ])
                if (whRes.status === "success") setWorkHour(whRes.data)
                if (hRes.status === "success") setHolidays(hRes.data)
                if (profRes.status === "success") setUserRole(profRes.data.role)
            } catch (error) {
                console.error("Error fetching settings or profile:", error)
            }
        }
        fetchSettingsAndProfile()
    }, [])

    const calculateStatusWaktu = React.useCallback((jamLapor: string, tanggalStr: string) => {
        if (!workHour) return "Tepat Waktu" // Fallback if settings not loaded

        try {
            // Check if it's a holiday
            const reportDate = parse(tanggalStr, "dd/MM/yyyy", new Date())
            const dateStr = format(reportDate, "yyyy-MM-dd")

            const isHoliday = holidays.some(h => {
                const start = new Date(h.tanggal_mulai)
                const end = new Date(h.tanggal_selesai)
                return dateStr >= h.tanggal_mulai && dateStr <= h.tanggal_selesai
            })

            const isWeekend = isSaturday(reportDate) || isSunday(reportDate)

            if (isHoliday || isWeekend) {
                return "Lembur (Hari Libur)"
            }

            // Check working hours
            const jamLaporObj = parse(jamLapor, "HH:mm", new Date())

            let jamMasuk: string, jamPulang: string
            if (isFriday(reportDate)) {
                jamMasuk = workHour.jam_masuk_jumat
                jamPulang = workHour.jam_pulang_jumat
            } else {
                jamMasuk = workHour.jam_masuk
                jamPulang = workHour.jam_pulang
            }

            const masukObj = parse(jamMasuk, "HH:mm", new Date())
            const pulangObj = parse(jamPulang, "HH:mm", new Date())

            // If reported before jam masuk or after jam pulang, it's overtime (Lembur)
            if (jamLaporObj < masukObj || jamLaporObj > pulangObj) {
                return "Lembur"
            }

            return "Tepat Waktu"
        } catch (error) {
            console.error("Error calculating status waktu:", error)
            return "Tepat Waktu"
        }
    }, [workHour, holidays])

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
                // Apply frontend time validation logic
                const validatedReports = response.data.map((report: Report) => ({
                    ...report,
                    status_waktu: calculateStatusWaktu(report.jam_lapor, report.tanggal)
                }))
                setReports(validatedReports)
                setTotalPages(response.pagination.total_pages)
                setTotalData(response.pagination.total_data)
            }
        } catch (error) {
            console.error("Error fetching reports:", error)
        } finally {
            setLoading(false)
        }
    }, [startDate, endDate, statusWaktu, statusReview, debouncedSearch, currentPage, calculateStatusWaktu])

    React.useEffect(() => {
        fetchReports()
    }, [fetchReports])

    const handleViewDetail = async (report: Report) => {
        try {
            // Kita ambil detail lebih lengkap dari API agar data baru muncul
            const fullReport = await getReportDetail(report.id)
            setSelectedReport(fullReport)

            const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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
            // Fallback ke data dari list jika API detail gagal
            setSelectedReport(report)

            const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

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
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => downloadReportsPDF({
                            start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
                            end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined
                        })}
                    >
                        <FileText className="size-4" />
                        <span className="hidden sm:inline">Export PDF</span>
                        <span className="sm:hidden">PDF</span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => downloadAttachments({
                            start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
                            end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined
                        })}
                    >
                        <Download className="size-4" />
                        <span className="hidden sm:inline">Lampiran</span>
                        <span className="sm:hidden">Lampiran</span>
                    </Button>
                    <Button
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        onClick={() => downloadReportsExcel({
                            start_date: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
                            end_date: endDate ? format(endDate, "yyyy-MM-dd") : undefined
                        })}
                    >
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
                                        {startDate ? format(startDate, "PPP") : <span>Pilih Tanggal</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
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
                                        {endDate ? format(endDate, "PPP") : <span>Pilih Tanggal</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
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

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status Waktu</label>
                            <Select value={statusWaktu} onValueChange={(val) => {
                                setStatusWaktu(val)
                                setCurrentPage(1)
                            }}>
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
                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cari Pegawai / Laporan</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Nama, Jabatan, atau Isi Laporan..."
                                    className="pl-9 h-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
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
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                                <span>Memuat data...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : reports.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground italic">
                                            Tidak ada data laporan ditemukan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.map((item, index) => (
                                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="text-center font-medium">
                                                {(currentPage - 1) * limit + index + 1}
                                            </TableCell>
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
                                                {item.jam_lapor}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "px-2.5 py-0.5 font-medium rounded-full border-transparent",
                                                        item.status_waktu === "Tepat Waktu"
                                                            ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400"
                                                    )}
                                                >
                                                    {item.status_waktu}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="secondary"
                                                    className={cn(
                                                        "px-2.5 py-0.5 font-medium rounded-full border-transparent",
                                                        item.status_review === "Disetujui"
                                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                                                            : "bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                                                    )}
                                                >
                                                    {item.status_review}
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CustomPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalData={totalData}
                    limit={limit}
                    itemName="laporan"
                />
            </Card>

            <DetailLaporanModal
                isOpen={isDetailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                report={selectedReport}
                fotoUrl={fotoUrl}
                dokumenUrl={dokumenUrl}
                role={userRole}
                onSuccess={fetchReports}
            />
        </div>
    )
}
