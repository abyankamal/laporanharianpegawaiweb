"use client"

import * as React from "react"
import Image from "next/image"
import { X, Calendar, Clock, FileText, CheckSquare, Image as ImageIcon, ExternalLink, MessageSquare, Send } from "lucide-react"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Report, evaluateReport } from "@/lib/api/reports"
import { Textarea } from "@/components/ui/textarea"

// Interface LaporanData dihapus karena kita menggunakan Report dari lib/api/reports.ts

interface DetailLaporanModalProps {
    report: Report | null
    isOpen: boolean
    onClose: () => void
    fotoUrl: string | null
    dokumenUrl?: string | null
    role?: string | null
    onSuccess?: () => void
}

export function DetailLaporanModal({
    report,
    isOpen,
    onClose,
    fotoUrl,
    dokumenUrl,
    role,
    onSuccess
}: DetailLaporanModalProps) {
    const [imgSrc, setImgSrc] = React.useState<string | null>(null)
    const [comment, setComment] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    React.useEffect(() => {
        if (report?.komentar_atasan) {
            setComment(report.komentar_atasan)
        } else {
            setComment("")
        }
    }, [report])

    React.useEffect(() => {
        if (fotoUrl) {
            setImgSrc(fotoUrl)
        } else {
            setImgSrc(null)
        }
    }, [fotoUrl])

    if (!report) return null

    const fallbackUrl = "https://images.unsplash.com/photo-1573163231162-717dfc3e4146?q=80&w=800"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center gap-2 border-b pb-4">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                        <FileText className="size-6" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Detail Laporan Kinerja</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    {/* Profil Pegawai Card */}
                    <div className="relative flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                <AvatarImage src={`/avatars/${report.nip}.png`} alt={report.nama} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                    {report.nama.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-1 right-1 size-3.5 rounded-full border-2 border-background bg-green-500 shadow-sm" />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold leading-none">{report.nama}</h3>
                                {report.owner_role && (
                                    <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-bold uppercase tracking-tight bg-slate-100 text-slate-600 border-none">
                                        {report.owner_role}
                                    </Badge>
                                )}
                            </div>
                            <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400 leading-none">
                                {report.jabatan}
                            </p>
                            <p className="mt-1.5 text-xs font-medium text-muted-foreground/80 font-mono">
                                NIP: {report.nip}
                            </p>
                        </div>
                    </div>

                    {/* Grid Informasi Waktu & Status */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                Tanggal Laporan
                            </span>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Calendar className="size-4 text-muted-foreground" />
                                {report.tanggal}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                Jam Lapor
                            </span>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Clock className="size-4 text-muted-foreground" />
                                {report.jam_lapor} WIB
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                Tipe Tugas
                            </span>
                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                                <FileText className="size-4" />
                                {report.jenis_tugas || "Tugas Individu"}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                Status Waktu
                            </span>
                            <div>
                                <Badge
                                    className={cn(
                                        "px-2.5 py-0.5 font-bold border-transparent",
                                        report.status_waktu === "Tepat Waktu"
                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
                                    )}
                                >
                                    {report.status_waktu}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Bagian Deskripsi Tugas */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                <CheckSquare className="size-4 text-blue-600" />
                                Rincian Kegiatan
                            </h4>
                            <Badge
                                variant="outline"
                                className={cn(
                                    "px-2.5 py-0.5 font-bold flex items-center gap-1.5 w-fit border-transparent",
                                    report.status_review === "Disetujui"
                                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                )}
                            >
                                <span className={cn(
                                    "size-2 rounded-full",
                                    report.status_review === "Disetujui" ? "bg-blue-600" : "bg-slate-400"
                                )} />
                                {report.status_review}
                            </Badge>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/40 dark:border-slate-800/60">
                            <h5 className="text-sm font-bold mb-2 text-blue-700 dark:text-blue-400">{report.laporan}</h5>
                            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap italic">
                                "{report.deskripsi || "Tidak ada deskripsi rinci"}"
                            </p>
                        </div>
                    </div>

                    {/* Lokasi (Jika Ada) */}
                    {report.lokasi && (
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                <div className="size-4 rounded-full bg-red-100 flex items-center justify-center">
                                    <div className="size-1.5 rounded-full bg-red-600" />
                                </div>
                                Lokasi Pelaporan
                            </h4>
                            <div className="px-4 py-3 bg-red-50/30 border border-red-100 rounded-lg dark:bg-red-950/10 dark:border-red-900/20">
                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {report.lokasi}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Komentar Atasan (Jika Ada) */}
                    {report.komentar_atasan?.trim() && (
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                <FileText className="size-4 text-emerald-600" />
                                Catatan / Masukan Atasan
                            </h4>
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl dark:bg-emerald-950/20 dark:border-emerald-900/30">
                                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 italic">
                                    "{report.komentar_atasan}"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Grid Lampiran (Foto & Dokumen) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Bagian Foto Bukti */}
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                <ImageIcon className="size-4 text-blue-600" />
                                Foto Bukti
                            </h4>
                            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border shadow-sm bg-muted flex items-center justify-center">
                                {imgSrc ? (
                                    <Image
                                        src={imgSrc}
                                        alt="Bukti Kerja"
                                        fill
                                        className="object-cover transition-transform hover:scale-105 duration-500"
                                        sizes="(max-width: 600px) 100vw, 300px"
                                        onError={() => {
                                            if (imgSrc !== fallbackUrl) {
                                                setImgSrc(fallbackUrl)
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground/60 p-4">
                                        <ImageIcon className="size-8" />
                                        <span className="text-[10px] font-medium">Tidak ada foto</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bagian Dokumen Lampiran */}
                        <div className="space-y-3">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                                <FileText className="size-4 text-blue-600" />
                                Dokumen
                            </h4>
                            {dokumenUrl ? (
                                <div className="h-full min-h-[150px] p-4 bg-muted/30 rounded-xl border border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-3">
                                    <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <FileText className="size-5" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-center line-clamp-2 px-2">
                                        Lampiran dokumen tersedia
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-[10px] h-7 gap-1.5 bg-background shadow-sm"
                                        onClick={() => window.open(dokumenUrl, '_blank')}
                                    >
                                        <ExternalLink className="size-3" />
                                        <span>Buka</span>
                                    </Button>
                                </div>
                            ) : (
                                <div className="h-full min-h-[150px] p-4 bg-slate-50 border border-slate-100 rounded-xl dark:bg-slate-900/20 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
                                    <FileText className="size-8 opacity-20" />
                                    <span className="text-[10px] font-medium">Tidak ada dokumen</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Evaluasi (Hanya untuk Lurah/Sekertaris dan jika belum disetujui) */}
                    {(role === "lurah" || role === "sekertaris") && report.status_review !== "Disetujui" && (
                        <div className="mt-4 space-y-4 rounded-2xl border-2 border-blue-100 bg-blue-50/30 p-5 dark:border-blue-900/30 dark:bg-blue-950/20">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                <MessageSquare className="size-5" />
                                <h4 className="text-sm font-bold">Evaluasi & Masukan Atasan</h4>
                            </div>

                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Tuliskan masukan atau catatan untuk laporan ini..."
                                    className="min-h-[100px] bg-background resize-none border-blue-100 focus-visible:ring-blue-400"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    * Menyimpan evaluasi akan otomatis mengubah status laporan menjadi "Disetujui".
                                </p>
                            </div>

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-200 dark:shadow-none"
                                onClick={async () => {
                                    if (!comment.trim()) {
                                        toast.error("Mohon isi komentar/masukan")
                                        return
                                    }

                                    setIsSubmitting(true)
                                    try {
                                        const res = await evaluateReport(report.id, "sudah_direview", comment)
                                        if (res.status === "success" || res.success) {
                                            toast.success("Evaluasi berhasil disimpan")
                                            if (onSuccess) onSuccess()
                                            onClose()
                                        } else {
                                            toast.error(res.message || "Gagal menyimpan evaluasi")
                                        }
                                    } catch (error) {
                                        toast.error("Terjadi kesalahan sistem")
                                    } finally {
                                        setIsSubmitting(false)
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <Send className="size-4" />
                                )}
                                Simpan & Setujui Laporan
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto font-bold">
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
