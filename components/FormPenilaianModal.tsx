"use client"

import * as React from "react"
import { Award, Star, CheckCircle2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Employee, getEmployees } from "@/lib/api/employees"
import { SKOR_PENILAIAN_LIST, createReview } from "@/lib/api/reviews"
import { useUser } from "@/components/UserContext"

interface FormPenilaianModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const NAMA_BULAN = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
]

export function FormPenilaianModal({
    isOpen,
    onClose,
    onSuccess,
}: FormPenilaianModalProps) {
    const { user } = useUser()
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [loadingEmployees, setLoadingEmployees] = React.useState(false)

    // Form states
    const [targetUserId, setTargetUserId] = React.useState<string>("")
    const [bulan, setBulan] = React.useState<number>(new Date().getMonth() + 1)
    const [tahun, setTahun] = React.useState<number>(new Date().getFullYear())
    const [skorId, setSkorId] = React.useState<number>(2) // Default 2: Sesuai Ekspektasi
    const [catatan, setCatatan] = React.useState<string>("")
    const [submitting, setSubmitting] = React.useState(false)

    React.useEffect(() => {
        const fetchEmployees = async () => {
            setLoadingEmployees(true)
            try {
                const res = await getEmployees({ page: 1, limit: 100 })
                if (res.success && res.data && res.data.list) {
                    const myRole = user?.role?.toLowerCase()
                    let filtered = res.data.list.filter(e => e.id !== user?.id)

                    // Hierarki penilaian SIOPIK
                    if (myRole === "lurah") {
                        filtered = filtered.filter(e => {
                            const r = e.role.toLowerCase()
                            return r === "sekertaris" || r === "kasi"
                        })
                    } else if (myRole === "sekertaris") {
                        filtered = filtered.filter(e => e.role.toLowerCase() === "staf")
                    }

                    setEmployees(filtered)
                }
            } catch (error) {
                console.error("Gagal mengambil data pegawai:", error)
            } finally {
                setLoadingEmployees(false)
            }
        }

        if (isOpen) {
            fetchEmployees()
            setTargetUserId("")
            setBulan(new Date().getMonth() + 1)
            setTahun(new Date().getFullYear())
            setSkorId(2)
            setCatatan("")
        }
    }, [isOpen, user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!targetUserId) {
            toast.error("Pilih pegawai yang akan dinilai")
            return
        }

        // Generate start & end date of the month
        const lastDay = new Date(tahun, bulan, 0).getDate()
        const pad = (n: number) => n.toString().padStart(2, "0")
        const tanggalMulai = `${tahun}-${pad(bulan)}-01`
        const tanggalSelesai = `${tahun}-${pad(bulan)}-${pad(lastDay)}`

        setSubmitting(true)
        try {
            const res = await createReview({
                target_user_id: Number(targetUserId),
                skor_id: Number(skorId),
                jenis_periode: "Bulanan",
                bulan: Number(bulan),
                tahun: Number(tahun),
                tanggal_mulai: tanggalMulai,
                tanggal_selesai: tanggalSelesai,
                catatan: catatan.trim(),
            })

            if (res.success || (res as any).status === "success") {
                toast.success("Penilaian kinerja berhasil disimpan!")
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || "Gagal menyimpan penilaian")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Terjadi kesalahan saat menyimpan penilaian")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="space-y-2 pb-2">
                        <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/40">
                            <Award className="size-5" />
                        </div>
                        <DialogTitle className="text-lg font-bold">Beri Penilaian Kinerja</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Berikan evaluasi kinerja bulanan kepada bawahan sesuai hierarki organisasi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-3">
                        {/* Pilih Pegawai */}
                        <div className="space-y-2">
                            <Label htmlFor="targetUser" className="text-xs font-semibold">
                                Pegawai yang Dinilai <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={targetUserId}
                                onValueChange={setTargetUserId}
                                required
                            >
                                <SelectTrigger id="targetUser">
                                    <SelectValue placeholder={loadingEmployees ? "Memuat pegawai..." : "Pilih Pegawai"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.length === 0 && !loadingEmployees ? (
                                        <SelectItem value="empty" disabled>
                                            Tidak ada bawahan yang dapat dinilai
                                        </SelectItem>
                                    ) : (
                                        employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                                {emp.nama} ({emp.nip}) - {emp.jabatan?.nama_jabatan || emp.role}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Periode Penilaian (Bulan & Tahun) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bulan" className="text-xs font-semibold">
                                    Bulan Evaluasi
                                </Label>
                                <Select
                                    value={bulan.toString()}
                                    onValueChange={(val) => setBulan(Number(val))}
                                >
                                    <SelectTrigger id="bulan">
                                        <SelectValue placeholder="Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {NAMA_BULAN.map((nama, idx) => (
                                            <SelectItem key={idx + 1} value={(idx + 1).toString()}>
                                                {nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tahun" className="text-xs font-semibold">
                                    Tahun
                                </Label>
                                <Select
                                    value={tahun.toString()}
                                    onValueChange={(val) => setTahun(Number(val))}
                                >
                                    <SelectTrigger id="tahun">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[2024, 2025, 2026, 2027].map((t) => (
                                            <SelectItem key={t} value={t.toString()}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Pilihan Skor Kinerja */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold">
                                Predikat / Skor Kinerja <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                {SKOR_PENILAIAN_LIST.map((skor) => {
                                    const isSelected = skorId === skor.id
                                    return (
                                        <button
                                            key={skor.id}
                                            type="button"
                                            onClick={() => setSkorId(skor.id)}
                                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                                isSelected
                                                    ? skor.id === 3
                                                        ? "border-blue-600 bg-blue-50/70 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 ring-2 ring-blue-500/20"
                                                        : skor.id === 2
                                                        ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                                                        : "border-amber-600 bg-amber-50/70 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 ring-2 ring-amber-500/20"
                                                    : "border-border hover:bg-muted/40 text-muted-foreground"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <span className="text-xs font-bold font-mono">Bobot: {skor.bobot_nilai}</span>
                                                {isSelected && <CheckCircle2 className="size-3.5 shrink-0" />}
                                            </div>
                                            <span className="text-xs font-medium leading-tight">
                                                {skor.keterangan}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Catatan / Feedback */}
                        <div className="space-y-2">
                            <Label htmlFor="catatan" className="text-xs font-semibold">
                                Catatan / Umpan Balik Kinerja (Opsional)
                            </Label>
                            <Textarea
                                id="catatan"
                                placeholder="Contoh: Sangat aktif dalam penyelesaian tugas kewilayahan dan pelaporan harian selalu tepat waktu."
                                value={catatan}
                                onChange={(e) => setCatatan(e.target.value)}
                                rows={3}
                                className="text-xs"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-3 border-t flex flex-col-reverse sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={submitting}
                            className="w-full sm:w-auto text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5"
                        >
                            {submitting ? "Menyimpan..." : "Kirim Penilaian"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
