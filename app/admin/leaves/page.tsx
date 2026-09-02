"use client"

import * as React from "react"
import {
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    PlusCircle,
    FileText,
    Upload,
    User,
    Check,
    AlertCircle,
    HeartPulse,
    Palmtree,
    ClipboardList,
    Building2,
    UploadCloud,
    X,
    Sparkles,
    CalendarRange,
    FileCheck,
    Search,
    ShieldCheck,
    Briefcase
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPendingIzin, approveIzin, createIzinByAdmin, PengajuanIzin } from "@/lib/api/leaves"
import { getEmployees, Employee } from "@/lib/api/employees"
import { toast } from "sonner"
import { format, differenceInCalendarDays, parseISO, isSameDay } from "date-fns"
import { id as localeID } from "date-fns/locale"

const CATEGORIES = [
    {
        id: "cuti",
        title: "Cuti Tahunan",
        icon: Palmtree,
        colorBg: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20",
        badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
        activeStyle: "border-blue-500 bg-blue-50/50 text-blue-950 dark:bg-blue-950/40 dark:text-blue-200 shadow-sm",
    },
    {
        id: "sakit",
        title: "Sakit",
        icon: HeartPulse,
        colorBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20",
        badge: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300",
        activeStyle: "border-rose-500 bg-rose-50/50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 shadow-sm",
    },
    {
        id: "izin",
        title: "Izin",
        icon: Clock,
        colorBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20",
        badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
        activeStyle: "border-amber-500 bg-amber-50/50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-200 shadow-sm",
    },
    {
        id: "dinas_luar",
        title: "Dinas Luar",
        icon: Building2,
        colorBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
        activeStyle: "border-emerald-500 bg-emerald-50/50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 shadow-sm",
    },
]

export default function ManajemenIzinPage() {
    const [activeTab, setActiveTab] = React.useState("create")

    // Pending List State
    const [pendingList, setPendingList] = React.useState<PengajuanIzin[]>([])
    const [loadingPending, setLoadingPending] = React.useState(true)
    const [processingId, setProcessingId] = React.useState<number | null>(null)
    const [searchPending, setSearchPending] = React.useState("")

    // Form Admin State
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [loadingEmployees, setLoadingEmployees] = React.useState(false)

    const [formData, setFormData] = React.useState({
        user_id: "",
        jenis_izin: "cuti",
        tanggal_mulai: "",
        tanggal_selesai: "",
        keterangan: "",
    })
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
    const [submittingForm, setSubmittingForm] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const fetchPending = React.useCallback(async () => {
        setLoadingPending(true)
        try {
            const res = await getPendingIzin()
            setPendingList(res.data || [])
        } catch (error) {
            console.error("Error fetching pending izin:", error)
        } finally {
            setLoadingPending(false)
        }
    }, [])

    const fetchEmployeesData = React.useCallback(async () => {
        setLoadingEmployees(true)
        try {
            const res = await getEmployees({ limit: 100 })
            const list = res.data?.list || []
            setEmployees(list)
            if (list.length > 0 && !formData.user_id) {
                setFormData(prev => ({ ...prev, user_id: list[0].id.toString() }))
            }
        } catch (error) {
            console.error("Error fetching employees for form:", error)
        } finally {
            setLoadingEmployees(false)
        }
    }, [formData.user_id])

    React.useEffect(() => {
        fetchPending()
        fetchEmployeesData()
    }, [fetchPending, fetchEmployeesData])

    // Set default dates to today
    React.useEffect(() => {
        const today = new Date()
        const formatDateStr = (d: Date) => {
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, "0")
            const day = String(d.getDate()).padStart(2, "0")
            return `${year}-${month}-${day}`
        }
        setFormData(prev => ({
            ...prev,
            tanggal_mulai: prev.tanggal_mulai || formatDateStr(today),
            tanggal_selesai: prev.tanggal_selesai || formatDateStr(today),
        }))
    }, [])

    // Duration in days
    const totalDays = React.useMemo(() => {
        if (!formData.tanggal_mulai || !formData.tanggal_selesai) return 0
        try {
            const start = parseISO(formData.tanggal_mulai)
            const end = parseISO(formData.tanggal_selesai)
            const diff = differenceInCalendarDays(end, start)
            return diff >= 0 ? diff + 1 : 0
        } catch {
            return 0
        }
    }, [formData.tanggal_mulai, formData.tanggal_selesai])

    // Selected Employee
    const selectedEmployee = React.useMemo(() => {
        return employees.find(e => e.id.toString() === formData.user_id) || null
    }, [employees, formData.user_id])

    const selectedCategory = React.useMemo(() => {
        return CATEGORIES.find(c => c.id === formData.jenis_izin) || CATEGORIES[0]
    }, [formData.jenis_izin])

    const handleApprove = async (id: number, approved: boolean) => {
        setProcessingId(id)
        try {
            await approveIzin(id, approved)
            toast.success(approved ? "Pengajuan izin berhasil disetujui" : "Pengajuan izin telah ditolak")
            fetchPending()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal memproses pengajuan izin")
        } finally {
            setProcessingId(null)
        }
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.user_id) {
            toast.error("Pilih pegawai terlebih dahulu")
            return
        }
        if (!formData.tanggal_mulai || !formData.tanggal_selesai) {
            toast.error("Tanggal mulai dan selesai wajib diisi")
            return
        }
        if (totalDays <= 0) {
            toast.error("Tanggal selesai tidak boleh lebih awal dari tanggal mulai")
            return
        }

        setSubmittingForm(true)
        try {
            await createIzinByAdmin({
                user_id: Number(formData.user_id),
                jenis_izin: formData.jenis_izin,
                tanggal_mulai: formData.tanggal_mulai,
                tanggal_selesai: formData.tanggal_selesai,
                keterangan: formData.keterangan || `Pencatatan ${selectedCategory.title}`,
                dokumen: selectedFile
            })
            toast.success("Pencatatan izin pegawai berhasil disimpan dan disetujui")
            setFormData(prev => ({
                ...prev,
                keterangan: "",
            }))
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ""
            fetchPending()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal mencatat izin pegawai")
        } finally {
            setSubmittingForm(false)
        }
    }

    // Days list for mini calendar preview
    const miniCalendarDays = React.useMemo(() => {
        const days = []
        const currentMonth = formData.tanggal_mulai ? parseISO(formData.tanggal_mulai) : new Date()
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const numDays = new Date(year, month + 1, 0).getDate()

        const startDate = formData.tanggal_mulai ? parseISO(formData.tanggal_mulai) : null
        const endDate = formData.tanggal_selesai ? parseISO(formData.tanggal_selesai) : null

        for (let i = 1; i <= Math.min(numDays, 28); i++) {
            const dateObj = new Date(year, month, i)
            let isSelected = false
            if (startDate && endDate) {
                isSelected = dateObj >= startDate && dateObj <= endDate
            }
            days.push({ day: i, isSelected })
        }
        return days
    }, [formData.tanggal_mulai, formData.tanggal_selesai])

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto p-1 sm:p-2">
            {/* Top Navigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Pencatatan Izin & Cuti Pegawai
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Kelola formulir pencatatan izin dan persetujuan pengajuan presensi bawahan.
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-muted/60 p-1 rounded-xl h-10">
                        <TabsTrigger value="create" className="text-xs font-semibold rounded-lg px-4 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <PlusCircle className="size-3.5" />
                            <span>Formulir Pengajuan</span>
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="text-xs font-semibold rounded-lg px-4 gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm relative">
                            <Clock className="size-3.5" />
                            <span>Menunggu Persetujuan</span>
                            {pendingList.length > 0 && (
                                <span className="size-2 rounded-full bg-amber-500 animate-pulse ml-1" />
                            )}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* TAB CONTENT 1: CREATE FORM */}
            {activeTab === "create" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT: FORMULIR PENGAJUAN (8 Cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground tracking-tight">Formulir Pengajuan</h2>
                            <p className="text-xs text-muted-foreground">Lengkapi data permohonan ketidakhadiran pegawai</p>
                        </div>

                        <Card className="shadow-sm border-border/80 rounded-2xl bg-card overflow-hidden">
                            <CardContent className="p-6 sm:p-8 space-y-6">
                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    {/* 1. Pilih Kategori Izin/Cuti */}
                                    <div className="space-y-2.5">
                                        <Label className="text-xs font-bold text-foreground">
                                            Pilih Kategori Izin/Cuti
                                        </Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {CATEGORIES.map((cat) => {
                                                const isSelected = formData.jenis_izin === cat.id
                                                const Icon = cat.icon
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, jenis_izin: cat.id }))}
                                                        className={`p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                                            isSelected
                                                                ? cat.activeStyle
                                                                : "border-border hover:border-muted-foreground/30 bg-muted/20"
                                                        }`}
                                                    >
                                                        <div className={`size-10 rounded-xl flex items-center justify-center ${cat.colorBg}`}>
                                                            <Icon className="size-5" />
                                                        </div>
                                                        <span className="text-xs font-bold tracking-tight text-foreground">
                                                            {cat.title}
                                                        </span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* 2. Pilih Pegawai & Tanggal Pelaksanaan */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                                        {/* Kolom Kiri: Pilih Pegawai */}
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold text-foreground">
                                                Pilih Pegawai
                                            </Label>
                                            <Select
                                                value={formData.user_id}
                                                onValueChange={(val) => setFormData(prev => ({ ...prev, user_id: val }))}
                                                required
                                            >
                                                <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border text-xs sm:text-sm">
                                                    <SelectValue placeholder="Pilih Pegawai" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60 rounded-xl">
                                                    {employees.map((emp) => (
                                                        <SelectItem key={emp.id} value={emp.id.toString()} className="py-2.5">
                                                            <div className="flex items-center gap-2.5">
                                                                <Avatar className="size-7">
                                                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                                                                        {emp.nama.slice(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col text-left">
                                                                    <span className="font-semibold text-xs text-foreground">{emp.nama}</span>
                                                                    <span className="text-[10px] text-muted-foreground font-mono">
                                                                        NIP: {emp.nip} • {emp.jabatan?.nama_jabatan || emp.role}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            {/* Small badge card for selected employee */}
                                            {selectedEmployee && (
                                                <div className="flex items-center gap-3 p-2.5 rounded-xl border bg-muted/30 mt-2">
                                                    <Avatar className="size-8">
                                                        <AvatarFallback className="text-xs bg-blue-600 text-white font-bold">
                                                            {selectedEmployee.nama.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="overflow-hidden">
                                                        <div className="text-xs font-bold text-foreground truncate">{selectedEmployee.nama}</div>
                                                        <div className="text-[10px] text-muted-foreground font-mono truncate">
                                                            NIP: {selectedEmployee.nip} • {selectedEmployee.jabatan?.nama_jabatan || selectedEmployee.role}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Kolom Kanan: Tanggal Pelaksanaan */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-bold text-foreground">
                                                    Tanggal Pelaksanaan
                                                </Label>
                                                {totalDays > 0 && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                                                        Durasi: {totalDays} Hari
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-muted-foreground">Start Date</span>
                                                    <Input
                                                        type="date"
                                                        value={formData.tanggal_mulai}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, tanggal_mulai: e.target.value }))}
                                                        className="h-11 rounded-xl bg-muted/20 border-border text-xs"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <span className="text-[10px] text-muted-foreground">End Date</span>
                                                    <Input
                                                        type="date"
                                                        value={formData.tanggal_selesai}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, tanggal_selesai: e.target.value }))}
                                                        className="h-11 rounded-xl bg-muted/20 border-border text-xs"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Keterangan/Alasan */}
                                    <div className="space-y-2">
                                        <Label htmlFor="keterangan" className="text-xs font-bold text-foreground">
                                            Keterangan / Alasan
                                        </Label>
                                        <Input
                                            id="keterangan"
                                            placeholder="Masukkan rincian keterangan atau alasan..."
                                            value={formData.keterangan}
                                            onChange={(e) => setFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                                            className="h-11 rounded-xl bg-muted/20 border-border text-xs sm:text-sm"
                                        />
                                    </div>

                                    {/* 4. Dokumen Pendukung */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-foreground">
                                            Dokumen Pendukung
                                        </Label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                        />

                                        {!selectedFile ? (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/60 hover:bg-primary/5 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
                                            >
                                                <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                    <UploadCloud className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-foreground">
                                                        Unggah Surat Undangan / Dokumen
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                                        Seret file atau klik di sini (PDF, JPG, PNG Max 5MB)
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-muted/30 border-muted-foreground/20">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="size-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                                                        <FileCheck className="size-5" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-bold text-foreground truncate">{selectedFile.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Berkas siap dilampirkan
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-full shrink-0"
                                                    onClick={() => {
                                                        setSelectedFile(null)
                                                        if (fileInputRef.current) fileInputRef.current.value = ""
                                                    }}
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {/* 5. Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={submittingForm}
                                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white font-bold text-sm rounded-xl shadow-lg transition-all"
                                    >
                                        {submittingForm ? "Memproses Permohonan..." : "Kirim Pengajuan"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: RINGKASAN PENGAJUAN (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground tracking-tight">Ringkasan Pengajuan</h2>
                            <p className="text-xs text-muted-foreground">Pratinjau langsung data yang akan disimpan</p>
                        </div>

                        <Card className="shadow-md border-border/80 rounded-2xl bg-card overflow-hidden sticky top-4">
                            <CardContent className="p-6 space-y-5">
                                {/* Profil Pegawai Card */}
                                <div className="flex items-center gap-3 pb-4 border-b">
                                    <Avatar className="size-12 rounded-2xl border-2 border-primary/20">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                                            {selectedEmployee ? selectedEmployee.nama.slice(0, 2).toUpperCase() : "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <h3 className="text-sm font-bold text-foreground truncate">
                                            {selectedEmployee?.nama || "Pilih Pegawai"}
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground font-mono truncate">
                                            NIP: {selectedEmployee?.nip || "-"}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground truncate">
                                            Jabatan: {selectedEmployee?.jabatan?.nama_jabatan || selectedEmployee?.role || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Detail Pengajuan Info */}
                                <div className="space-y-3">
                                    <div className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
                                        Detail Pengajuan
                                    </div>

                                    <div className="flex items-center justify-between text-xs py-1">
                                        <span className="text-muted-foreground">Kategori</span>
                                        <Badge className={`font-bold ${selectedCategory.badge}`}>
                                            {selectedCategory.title}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between text-xs py-1">
                                        <span className="text-muted-foreground">Durasi</span>
                                        <span className="font-semibold text-foreground">
                                            {totalDays} Hari: {formData.tanggal_mulai ? format(parseISO(formData.tanggal_mulai), "dd MMM", { locale: localeID }) : "-"} - {formData.tanggal_selesai ? format(parseISO(formData.tanggal_selesai), "dd MMM yyyy", { locale: localeID }) : "-"}
                                        </span>
                                    </div>

                                    <div className="flex items-start justify-between text-xs py-1">
                                        <span className="text-muted-foreground">Alasan</span>
                                        <span className="font-semibold text-foreground text-right max-w-[180px] truncate">
                                            {formData.keterangan || "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Mini Calendar Visual Component */}
                                <div className="p-3.5 rounded-xl bg-muted/40 border space-y-2">
                                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground">
                                        <span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                        {miniCalendarDays.slice(0, 14).map((d) => (
                                            <div
                                                key={d.day}
                                                className={`size-7 mx-auto rounded-full flex items-center justify-center text-[11px] font-medium transition-all ${
                                                    d.isSelected
                                                        ? "bg-blue-600 text-white font-bold shadow-sm"
                                                        : "text-foreground/80 hover:bg-muted"
                                                }`}
                                            >
                                                {d.day}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Validasi Approval Status */}
                                <div className="pt-2 border-t flex items-center justify-between">
                                    <span className="text-xs font-bold text-foreground">Validasi Approval</span>
                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 gap-1 text-xs py-1 px-2.5 font-bold">
                                        <ShieldCheck className="size-3.5" />
                                        <span>Verified</span>
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* TAB CONTENT 2: PENDING LIST */}
            {activeTab === "pending" && (
                <Card className="shadow-sm border-border/80 rounded-2xl bg-card overflow-hidden">
                    <CardHeader className="bg-muted/20 border-b p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-base font-bold">Daftar Pengajuan Menunggu Persetujuan</CardTitle>
                            <CardDescription className="text-xs">
                                Pengajuan izin/sakit/cuti dari aplikasi mobile yang memerlukan persetujuan Lurah / Admin.
                            </CardDescription>
                        </div>
                        <div className="flex items-center w-full sm:w-72 h-9 border border-input rounded-xl px-3 bg-background focus-within:ring-2 focus-within:ring-primary/20">
                            <Search className="size-3.5 text-muted-foreground shrink-0 mr-2" />
                            <input
                                className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                                placeholder="Cari pegawai atau keterangan..."
                                value={searchPending}
                                onChange={(e) => setSearchPending(e.target.value)}
                            />
                        </div>
                    </CardHeader>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow>
                                    <TableHead className="min-w-[180px]">PEGAWAI</TableHead>
                                    <TableHead className="min-w-[120px]">JENIS</TableHead>
                                    <TableHead className="min-w-[200px]">PERIODE TANGGAL</TableHead>
                                    <TableHead className="min-w-[220px]">KETERANGAN</TableHead>
                                    <TableHead className="min-w-[120px]">DOKUMEN</TableHead>
                                    <TableHead className="text-right min-w-[180px]">AKSI PERSETUJUAN</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loadingPending ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                                            Memuat daftar pengajuan izin...
                                        </TableCell>
                                    </TableRow>
                                ) : pendingList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground">
                                            Tidak ada pengajuan izin yang menunggu persetujuan.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    pendingList.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell className="font-semibold text-sm">
                                                <div className="font-medium text-foreground">{item.user?.nama || `User #${item.user_id}`}</div>
                                                <div className="text-xs text-muted-foreground font-mono">{item.user?.nip || ""}</div>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                    {item.jenis_izin}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">
                                                {item.tanggal_mulai} s/d {item.tanggal_selesai}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground max-w-[240px] truncate">
                                                {item.keterangan || "-"}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {item.dokumen_path ? (
                                                    <a
                                                        href={`/${item.dokumen_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition-colors"
                                                    >
                                                        <FileText className="size-3.5" />
                                                        <span>Lihat Berkas</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic">Tidak ada</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1 shadow-sm"
                                                        onClick={() => handleApprove(item.id, true)}
                                                        disabled={processingId === item.id}
                                                    >
                                                        <CheckCircle2 className="size-3.5" />
                                                        <span>Setujui</span>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs gap-1 dark:border-red-900"
                                                        onClick={() => handleApprove(item.id, false)}
                                                        disabled={processingId === item.id}
                                                    >
                                                        <XCircle className="size-3.5" />
                                                        <span>Tolak</span>
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
            )}
        </div>
    )
}
