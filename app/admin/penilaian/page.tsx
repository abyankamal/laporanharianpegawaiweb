"use client"

import * as React from "react"
import {
    Award,
    Plus,
    Search,
    Star,
    CheckCircle2,
    TrendingUp,
    Building2,
    AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PenilaianItem, getMySubmittedReviews } from "@/lib/api/reviews"
import { FormPenilaianModal } from "@/components/FormPenilaianModal"
import { useUser } from "@/components/UserContext"

const NAMA_BULAN = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

export default function PenilaianKinerjaPage() {
    const { user } = useUser()
    const [reviews, setReviews] = React.useState<PenilaianItem[]>([])
    const [loading, setLoading] = React.useState(true)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [filterTahun, setFilterTahun] = React.useState<string>("all")
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    const fetchReviews = React.useCallback(async () => {
        setLoading(true)
        try {
            const res = await getMySubmittedReviews()
            if (res.success && Array.isArray(res.data)) {
                setReviews(res.data)
            }
        } catch (error) {
            console.error("Gagal mengambil riwayat penilaian:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    const filteredReviews = React.useMemo(() => {
        return reviews.filter((item) => {
            const matchesSearch =
                !searchTerm ||
                (item.user?.nama || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.user?.nip || "").includes(searchTerm) ||
                (item.catatan || "").toLowerCase().includes(searchTerm.toLowerCase())

            const matchesTahun =
                filterTahun === "all" || item.tahun.toString() === filterTahun

            return matchesSearch && matchesTahun
        })
    }, [reviews, searchTerm, filterTahun])

    const totalDiatas = reviews.filter((r) => r.skor_id === 3 || r.skor?.bobot_nilai === 3).length
    const totalSesuai = reviews.filter((r) => r.skor_id === 2 || r.skor?.bobot_nilai === 2).length
    const totalDibawah = reviews.filter((r) => r.skor_id === 1 || r.skor?.bobot_nilai === 1).length

    const renderSkorBadge = (item: PenilaianItem) => {
        const bobot = item.skor?.bobot_nilai || item.skor_id
        const ket = item.skor?.keterangan || (
            bobot === 3 ? "Diatas Ekspektasi" : bobot === 2 ? "Sesuai Ekspektasi" : "Dibawah Ekspektasi"
        )

        if (bobot === 3) {
            return (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1.5">
                    <Star className="size-3 fill-blue-600 text-blue-600" />
                    <span>{ket}</span>
                </span>
            )
        }
        if (bobot === 2) {
            return (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-emerald-600" />
                    <span>{ket}</span>
                </span>
            )
        }
        return (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1.5">
                <AlertCircle className="size-3 text-amber-600" />
                <span>{ket}</span>
            </span>
        )
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

    const canSubmitReview = user?.role === "lurah" || user?.role === "sekertaris" || user?.role === "admin"

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-1 sm:p-2 selection:bg-blue-600 selection:text-white">

            {/* Header: Eyebrow + Title + Actions */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                        <Building2 className="size-3.5 text-slate-500" />
                        <span>Evaluasi Predikat Kinerja ASN</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">Kelurahan Sukanegla</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Penilaian Kinerja Pegawai
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Pemberian predikat capaian kinerja bulanan kepada seluruh aparatur berdasarkan produktivitas dan kualitas laporan harian.
                    </p>
                </div>

                {/* Island Action Button */}
                {canSubmitReview && (
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
                        >
                            <span>Beri Penilaian</span>
                            <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:rotate-90 group-hover:bg-white/25">
                                <Plus className="size-3.5" />
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Asymmetrical Bento Metrics: 4 Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Tile 1: Total Penilaian */}
                <div className="rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                    <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex flex-col justify-between space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                Total Evaluasi
                            </span>
                            <div className="size-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                                <Award className="size-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                                {reviews.length} <span className="text-sm font-semibold text-slate-400">Pegawai</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Riwayat evaluasi tercatat</p>
                        </div>
                    </div>
                </div>

                {/* Tile 2: Diatas Ekspektasi */}
                <div className="rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                    <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex flex-col justify-between space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                Diatas Ekspektasi
                            </span>
                            <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                                <Star className="size-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-blue-700 font-mono tracking-tight tabular-nums">
                                {totalDiatas} <span className="text-sm font-semibold text-slate-400">Pegawai</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Predikat kinerja istimewa</p>
                        </div>
                    </div>
                </div>

                {/* Tile 3: Sesuai Ekspektasi */}
                <div className="rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                    <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex flex-col justify-between space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                Sesuai Ekspektasi
                            </span>
                            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <CheckCircle2 className="size-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight tabular-nums">
                                {totalSesuai} <span className="text-sm font-semibold text-slate-400">Pegawai</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Predikat kinerja standar baik</p>
                        </div>
                    </div>
                </div>

                {/* Tile 4: Dibawah Ekspektasi */}
                <div className="rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                    <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex flex-col justify-between space-y-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Dibawah Ekspektasi
                            </span>
                            <div className="size-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                                <TrendingUp className="size-4" />
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-extrabold text-amber-700 font-mono tracking-tight tabular-nums">
                                {totalDibawah} <span className="text-sm font-semibold text-slate-400">Pegawai</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">Perlu pembinaan lanjutan</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Filter Bar & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        className="w-full h-10 pl-10 pr-4 bg-white rounded-full border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm transition-all"
                        placeholder="Cari nama pegawai, NIP, atau catatan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Select value={filterTahun} onValueChange={setFilterTahun}>
                    <SelectTrigger className="w-full sm:w-40 h-10 rounded-full bg-white border-slate-200 text-xs font-bold shadow-sm">
                        <SelectValue placeholder="Tahun" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                        <SelectItem value="all" className="text-xs">Semua Tahun</SelectItem>
                        <SelectItem value="2027" className="text-xs">2027</SelectItem>
                        <SelectItem value="2026" className="text-xs">2026</SelectItem>
                        <SelectItem value="2025" className="text-xs">2025</SelectItem>
                        <SelectItem value="2024" className="text-xs">2024</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Main Table: Double-Bezel Hardware Architecture */}
            <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                <div className="rounded-[calc(2rem-0.5rem)] bg-white overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                <TableRow>
                                    <TableHead className="w-16 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">NO</TableHead>
                                    <TableHead className="min-w-55 text-[11px] font-bold uppercase tracking-wider text-slate-500">PEGAWAI</TableHead>
                                    <TableHead className="min-w-35 text-[11px] font-bold uppercase tracking-wider text-slate-500">JABATAN</TableHead>
                                    <TableHead className="min-w-35 text-[11px] font-bold uppercase tracking-wider text-slate-500">PERIODE</TableHead>
                                    <TableHead className="min-w-45 text-[11px] font-bold uppercase tracking-wider text-slate-500">PREDIKAT SKOR</TableHead>
                                    <TableHead className="min-w-55 text-[11px] font-bold uppercase tracking-wider text-slate-500">CATATAN ATASAN</TableHead>
                                    <TableHead className="text-right min-w-32.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">TANGGAL DINILAI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-100">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
                                                <span className="text-xs font-semibold text-slate-500">Memuat riwayat penilaian...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredReviews.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-slate-400">
                                            <div className="space-y-1">
                                                <Award className="size-6 mx-auto opacity-30" />
                                                <p className="text-xs font-medium">Belum ada riwayat penilaian kinerja pada periode ini.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredReviews.map((item, index) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            <TableCell className="text-center text-xs font-mono text-slate-400">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700 font-mono shrink-0">
                                                        {getInitials(item.user?.nama || "")}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <span className="text-xs font-bold text-slate-900 block truncate">
                                                            {item.user?.nama || `Pegawai #${item.user_id}`}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                                                            NIP: {item.user?.nip || "-"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-600 font-medium">
                                                {item.user?.jabatan?.nama_jabatan || item.user?.role || "-"}
                                            </TableCell>
                                            <TableCell className="text-xs font-bold font-mono text-slate-900">
                                                {NAMA_BULAN[item.bulan - 1] || item.bulan} {item.tahun}
                                            </TableCell>
                                            <TableCell>
                                                {renderSkorBadge(item)}
                                            </TableCell>
                                            <TableCell className="text-xs text-slate-600 max-w-xs truncate">
                                                {item.catatan || "-"}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-slate-500 font-mono">
                                                {item.created_at
                                                    ? format(new Date(item.created_at), "dd MMM yyyy", { locale: localeID })
                                                    : "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between text-xs text-slate-500">
                        <span>Total {filteredReviews.length} penilaian kinerja tercatat</span>
                        <span className="font-mono text-[11px] text-slate-400">SKP & Evaluasi Triwulan / Bulanan Kelurahan</span>
                    </div>

                </div>
            </div>

            {/* Modal Beri Penilaian */}
            <FormPenilaianModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchReviews}
            />

        </div>
    )
}
