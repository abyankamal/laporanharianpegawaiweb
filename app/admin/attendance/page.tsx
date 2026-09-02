"use client"

import * as React from "react"
import {
    FileDown,
    Calendar,
    Search,
    UserCheck,
    Clock,
    FileSpreadsheet,
    AlertCircle,
    Building2,
    CheckCircle2,
    HeartPulse,
    Palmtree,
    MapPin,
    XCircle,
    FileText,
    Users,
    ChevronDown,
    TrendingUp
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
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getAbsensiRecap, exportAbsensiPDF, AbsensiRecapItem } from "@/lib/api/attendance"
import { toast } from "sonner"

const BULAN_LIST = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
]

export default function RekapAbsensiPage() {
    const now = new Date()
    const [selectedBulan, setSelectedBulan] = React.useState<number>(now.getMonth() + 1)
    const [selectedTahun, setSelectedTahun] = React.useState<number>(now.getFullYear())
    const [recapData, setRecapData] = React.useState<AbsensiRecapItem[]>([])
    const [loading, setLoading] = React.useState(true)
    const [exporting, setExporting] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [kategoriFilter, setKategoriFilter] = React.useState<string>("semua")

    const fetchRecap = React.useCallback(async () => {
        setLoading(true)
        try {
            const res = await getAbsensiRecap(selectedBulan, selectedTahun)
            setRecapData(res.data?.recap || [])
        } catch (error) {
            console.error("Error fetching absensi recap:", error)
            toast.error("Gagal mengambil data rekap absensi")
        } finally {
            setLoading(false)
        }
    }, [selectedBulan, selectedTahun])

    React.useEffect(() => {
        fetchRecap()
    }, [fetchRecap])

    const handleExportPDF = async () => {
        setExporting(true)
        try {
            const blob = await exportAbsensiPDF(selectedBulan, selectedTahun)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            const namaBulan = BULAN_LIST.find(b => b.value === selectedBulan)?.label || selectedBulan
            a.download = `rekap_absensi_${namaBulan}_${selectedTahun}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success("Berhasil mengunduh laporan PDF rekap absensi")
        } catch (error) {
            console.error("Error exporting PDF:", error)
            toast.error("Gagal mengunduh laporan PDF")
        } finally {
            setExporting(false)
        }
    }

    const filteredData = recapData.filter(item => {
        const matchesSearch =
            (item.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.nip || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.jabatan || "").toLowerCase().includes(searchTerm.toLowerCase())

        if (!matchesSearch) return false

        if (kategoriFilter === "semua") return true
        const kat = (item.kategori_pegawai || "").toLowerCase()
        if (kategoriFilter === "pns") return kat.includes("pns")
        if (kategoriFilter === "penuh") return kat.includes("penuh")
        if (kategoriFilter === "paruh") return kat.includes("paruh")
        return true
    })

    const totalHadir = recapData.reduce((acc, item) => acc + (item.hadir || 0), 0)
    const totalIzinSakitCuti = recapData.reduce((acc, item) => acc + (item.sakit || 0) + (item.cuti || 0) + (item.izin || 0) + (item.dinas_luar || 0), 0)
    const totalJamKerja = recapData.reduce((acc, item) => acc + (item.total_jam_kerja || 0), 0)
    const rataRataJam = recapData.length > 0 ? (totalJamKerja / recapData.length).toFixed(1) : "0.0"

    const namaBulanAktif = BULAN_LIST.find(b => b.value === selectedBulan)?.label || selectedBulan

    const getInitials = (name: string) => {
        if (!name) return "??"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
    }

    const renderKategoriBadge = (kategori: string) => {
        const k = (kategori || "").toLowerCase()
        if (k.includes("pns")) {
            return (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-block">
                    PNS
                </span>
            )
        } else if (k.includes("penuh")) {
            return (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                    PPPK Penuh Waktu
                </span>
            )
        } else if (k.includes("paruh")) {
            return (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 inline-block">
                    PPPK Paruh Waktu
                </span>
            )
        }
        return <span className="text-slate-400 text-xs">{kategori || "-"}</span>
    }

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-1 sm:p-2 selection:bg-blue-600 selection:text-white">
            
            {/* Header: Eyebrow + Title + Period Selectors & Export */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                        <Building2 className="size-3.5 text-slate-500" />
                        <span>Rekapitulasi Presensi ASN</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">Periode {namaBulanAktif} {selectedTahun}</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Rekapitulasi Absensi Pegawai
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Data kehadiran presensi bulanan seluruh aparatur sipil kelurahan terintegrasi dengan durasi jam kerja efektif.
                    </p>
                </div>

                {/* Island Actions (Month/Year Switcher + PDF Export) */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Month Picker */}
                    <Select value={selectedBulan.toString()} onValueChange={(val) => setSelectedBulan(Number(val))}>
                        <SelectTrigger className="h-10 w-36 rounded-full bg-white border-slate-200 text-xs font-bold shadow-sm">
                            <SelectValue placeholder="Bulan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                            {BULAN_LIST.map((b) => (
                                <SelectItem key={b.value} value={b.value.toString()} className="text-xs">
                                    {b.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Year Picker */}
                    <Select value={selectedTahun.toString()} onValueChange={(val) => setSelectedTahun(Number(val))}>
                        <SelectTrigger className="h-10 w-28 rounded-full bg-white border-slate-200 text-xs font-bold shadow-sm">
                            <SelectValue placeholder="Tahun" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                            {[2024, 2025, 2026, 2027].map((t) => (
                                <SelectItem key={t} value={t.toString()} className="text-xs">
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Export PDF Button */}
                    <button
                        onClick={handleExportPDF}
                        disabled={exporting}
                        className="group inline-flex items-center gap-2.5 pl-4 pr-2 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    >
                        <span>{exporting ? "Memproses..." : "Ekspor PDF"}</span>
                        <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:translate-y-0.5 group-hover:bg-white/25">
                            <FileDown className="size-3.5" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Asymmetrical Bento Metrics: 3 Double-Bezel Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Tile 1: Total Kehadiran */}
                <div className="rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                    <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex flex-col justify-between space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Kehadiran Efektif
                            </span>
                            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <UserCheck className="size-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight tabular-nums">
                                {totalHadir} <span className="text-sm font-semibold text-slate-400">Hari</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Akumulasi presensi masuk seluruh pegawai</p>
                        </div>
                    </div>
                </div>

                {/* Tile 2: Izin, Sakit, Cuti & DL */}
                <div className="rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                    <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex flex-col justify-between space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Ketidakhadiran Berizin
                            </span>
                            <div className="size-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                                <Calendar className="size-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-amber-700 font-mono tracking-tight tabular-nums">
                                {totalIzinSakitCuti} <span className="text-sm font-semibold text-slate-400">Hari</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Gabungan cuti, sakit, izin, dan dinas luar</p>
                        </div>
                    </div>
                </div>

                {/* Tile 3: Total Akumulasi Jam Kerja */}
                <div className="rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                    <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex flex-col justify-between space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                Total Jam Kerja
                            </span>
                            <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                                <Clock className="size-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-blue-700 font-mono tracking-tight tabular-nums">
                                {totalJamKerja.toFixed(1)} <span className="text-sm font-semibold text-slate-400">Jam</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Rata-rata: {rataRataJam} jam / pegawai</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Filter Pill Bar & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Kategori ASN Filter Pills */}
                <div className="p-1 rounded-full bg-slate-100 border border-slate-200 flex items-center gap-1 flex-wrap">
                    {[
                        { id: "semua", label: "Semua ASN" },
                        { id: "pns", label: "PNS" },
                        { id: "penuh", label: "PPPK Penuh Waktu" },
                        { id: "paruh", label: "PPPK Paruh Waktu" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setKategoriFilter(tab.id)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                kategoriFilter === tab.id
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        className="w-full h-10 pl-10 pr-4 bg-white rounded-full border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm transition-all"
                        placeholder="Cari nama atau NIP pegawai..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Table: Double-Bezel Hardware Enclosure */}
            <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                <div className="rounded-[calc(2rem-0.5rem)] bg-white overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                    
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                <TableRow>
                                    <TableHead className="w-12 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">NO</TableHead>
                                    <TableHead className="min-w-[200px] text-[11px] font-bold uppercase tracking-wider text-slate-500">PEGAWAI</TableHead>
                                    <TableHead className="min-w-[150px] text-[11px] font-bold uppercase tracking-wider text-slate-500">JABATAN</TableHead>
                                    <TableHead className="min-w-[140px] text-[11px] font-bold uppercase tracking-wider text-slate-500">KATEGORI</TableHead>
                                    <TableHead className="text-center min-w-[70px] text-[11px] font-bold uppercase tracking-wider text-emerald-700">HADIR</TableHead>
                                    <TableHead className="text-center min-w-[70px] text-[11px] font-bold uppercase tracking-wider text-amber-700">SAKIT</TableHead>
                                    <TableHead className="text-center min-w-[70px] text-[11px] font-bold uppercase tracking-wider text-blue-700">CUTI</TableHead>
                                    <TableHead className="text-center min-w-[70px] text-[11px] font-bold uppercase tracking-wider text-purple-700">IZIN</TableHead>
                                    <TableHead className="text-center min-w-[80px] text-[11px] font-bold uppercase tracking-wider text-cyan-700">DINAS LUAR</TableHead>
                                    <TableHead className="text-center min-w-[70px] text-[11px] font-bold uppercase tracking-wider text-rose-700">ALPA</TableHead>
                                    <TableHead className="text-right min-w-[110px] text-[11px] font-bold uppercase tracking-wider text-slate-700">JAM KERJA</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-100">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={11} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
                                                <span className="text-xs font-semibold text-slate-500">Memuat rekap absensi...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11} className="h-32 text-center text-slate-400">
                                            <div className="space-y-1">
                                                <UserCheck className="size-6 mx-auto opacity-30" />
                                                <p className="text-xs font-medium">Tidak ada data absensi untuk periode ini.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((item, idx) => (
                                        <TableRow key={idx} className="hover:bg-slate-50/60 transition-colors group">
                                            {/* No */}
                                            <TableCell className="text-center text-xs font-mono text-slate-400">
                                                {idx + 1}
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
                                                            NIP: {item.nip || "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Jabatan */}
                                            <TableCell className="text-xs text-slate-600 font-medium">
                                                {item.jabatan || "-"}
                                            </TableCell>

                                            {/* Kategori */}
                                            <TableCell>
                                                {renderKategoriBadge(item.kategori_pegawai)}
                                            </TableCell>

                                            {/* Hadir */}
                                            <TableCell className="text-center font-bold font-mono text-xs text-emerald-700 bg-emerald-50/40">
                                                {item.hadir || 0}
                                            </TableCell>

                                            {/* Sakit */}
                                            <TableCell className="text-center font-semibold font-mono text-xs text-amber-700">
                                                {item.sakit || 0}
                                            </TableCell>

                                            {/* Cuti */}
                                            <TableCell className="text-center font-semibold font-mono text-xs text-blue-700">
                                                {item.cuti || 0}
                                            </TableCell>

                                            {/* Izin */}
                                            <TableCell className="text-center font-semibold font-mono text-xs text-purple-700">
                                                {item.izin || 0}
                                            </TableCell>

                                            {/* Dinas Luar */}
                                            <TableCell className="text-center font-semibold font-mono text-xs text-cyan-700">
                                                {item.dinas_luar || 0}
                                            </TableCell>

                                            {/* Alpa */}
                                            <TableCell className="text-center font-semibold font-mono text-xs text-rose-700">
                                                {item.alpa || 0}
                                            </TableCell>

                                            {/* Total Jam Kerja */}
                                            <TableCell className="text-right font-bold font-mono text-xs text-slate-900">
                                                {item.total_jam_kerja ? item.total_jam_kerja.toFixed(1) : "0.0"} Jam
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Table Footer Summary Note */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                        <span>Menampilkan {filteredData.length} data aparatur kelurahan</span>
                        <span className="font-mono text-[11px] text-slate-400">Data terhitung otomatis dari presensi masuk & kepulangan SIOPIK</span>
                    </div>

                </div>
            </div>

        </div>
    )
}
