"use client"

import * as React from "react"
import Image from "next/image"
import {
    X,
    Calendar,
    Clock,
    FileText,
    CheckSquare,
    Image as ImageIcon,
    ExternalLink,
    MessageSquare,
    Send,
    ZoomIn,
    MapPin,
    ShieldCheck,
    CheckCircle2,
    Building2,
    FileCheck
} from "lucide-react"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Report, evaluateReport } from "@/lib/api/reports"
import { Textarea } from "@/components/ui/textarea"

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
    const [isImagePreviewOpen, setIsImagePreviewOpen] = React.useState(false)

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
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px] max-h-[92vh] overflow-y-auto rounded-[2rem] p-0 border-0 bg-transparent shadow-2xl">
                {/* Double-Bezel Nested Hardware Shell */}
                <div className="rounded-[2rem] bg-slate-100/95 border border-slate-200/90 p-2">
                    <div className="rounded-[calc(2rem-0.5rem)] bg-white overflow-hidden shadow-sm flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                                    <FileCheck className="size-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                                        Rincian Laporan Kinerja
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        Dokumen verifikasi kegiatan kerja aparatur kelurahan
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 text-slate-900">
                            
                            {/* 1. Profil Pegawai (Nested Squircle Card) */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-sm font-bold font-mono shrink-0 shadow-sm">
                                    {getInitials(report.nama)}
                                </div>
                                <div className="overflow-hidden space-y-0.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-bold text-slate-900 truncate">{report.nama}</h4>
                                        {report.owner_role && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                                                {report.owner_role}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs font-semibold text-blue-700 font-mono truncate">{report.jabatan}</p>
                                    <p className="text-[11px] text-slate-400 font-mono">NIP: {report.nip}</p>
                                </div>
                            </div>

                            {/* 2. Grid Metadata Waktu & Status */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal</span>
                                    <p className="text-xs font-bold text-slate-900 font-mono">{report.tanggal}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Waktu Lapor</span>
                                    <p className="text-xs font-bold text-slate-900 font-mono">{report.jam_lapor} WIB</p>
                                </div>
                                <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-50/70 border border-slate-200/70 space-y-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status Waktu</span>
                                    <div>
                                        {report.status_waktu === "Tepat Waktu" ? (
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                                                Tepat Waktu
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 inline-block">
                                                {report.status_waktu}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 3. Uraian & Deskripsi Rinci */}
                            <div className="space-y-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                    Uraian Hasil Kerja
                                </span>
                                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2">
                                    <h5 className="text-xs font-bold text-slate-900">{report.laporan}</h5>
                                    <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-wrap">
                                        {report.deskripsi || "Tidak ada rincian deskripsi tambahan."}
                                    </p>
                                </div>
                            </div>

                            {/* 4. Lokasi Kerja (Jika Ada) */}
                            {report.lokasi && (
                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                        Koordinat & Lokasi
                                    </span>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2 text-xs text-slate-700">
                                        <MapPin className="size-4 text-rose-600 shrink-0" />
                                        <span className="font-medium truncate">{report.lokasi}</span>
                                    </div>
                                </div>
                            )}

                            {/* 5. Catatan / Komentar Atasan Sebelumnya */}
                            {report.komentar_atasan?.trim() && (
                                <div className="space-y-1.5">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                                        Catatan / Masukan Evaluasi
                                    </span>
                                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium italic">
                                        "{report.komentar_atasan}"
                                    </div>
                                </div>
                            )}

                            {/* 6. Lampiran Foto & Dokumen */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                {/* Foto Bukti */}
                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                        Foto Dokumentasi
                                    </span>
                                    <div
                                        onClick={() => { if (imgSrc) setIsImagePreviewOpen(true) }}
                                        className={cn(
                                            "relative aspect-[4/3] rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden group",
                                            imgSrc ? "cursor-pointer" : ""
                                        )}
                                    >
                                        {imgSrc ? (
                                            <>
                                                <Image
                                                    src={imgSrc}
                                                    alt="Foto Bukti Kerja"
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    sizes="300px"
                                                    onError={() => {
                                                        if (imgSrc !== fallbackUrl) setImgSrc(fallbackUrl)
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                                                    <ZoomIn className="size-5" />
                                                    <span className="text-[11px] font-bold">Perbesar</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center text-slate-400 text-xs space-y-1">
                                                <ImageIcon className="size-6 mx-auto opacity-40" />
                                                <p className="text-[10px]">Tidak ada foto</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dokumen Lampiran */}
                                <div className="space-y-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                        Dokumen Pendukung
                                    </span>
                                    {dokumenUrl ? (
                                        <div className="h-[calc(100%-1.5rem)] min-h-[140px] p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-2.5 text-center">
                                            <div className="size-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                                                <FileText className="size-4" />
                                            </div>
                                            <p className="text-[11px] font-medium text-slate-600">Berkas dokumen terlampir</p>
                                            <button
                                                onClick={() => window.open(dokumenUrl, '_blank')}
                                                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-blue-700 shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <ExternalLink className="size-3" />
                                                <span>Buka Berkas</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-[calc(100%-1.5rem)] min-h-[140px] p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400">
                                            <FileText className="size-6 opacity-30" />
                                            <span className="text-[10px]">Tidak ada berkas</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 7. Form Evaluasi Atasan (Hanya untuk Lurah / Sekertaris jika belum approved) */}
                            {(role === "lurah" || role === "sekertaris") && report.status_review !== "Disetujui" && (
                                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                                    <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                                        <MessageSquare className="size-4 text-blue-700" />
                                        <span>Beri Catatan & Setujui Laporan</span>
                                    </div>
                                    <Textarea
                                        placeholder="Tuliskan masukan atau catatan arahan untuk bawahan..."
                                        className="min-h-[80px] bg-white border-blue-200 rounded-xl text-xs resize-none"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <Button
                                        className="w-full h-10 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm gap-2"
                                        disabled={isSubmitting}
                                        onClick={async () => {
                                            if (!comment.trim()) {
                                                toast.error("Mohon isi komentar / arahan evaluasi")
                                                return
                                            }
                                            setIsSubmitting(true)
                                            try {
                                                const res = await evaluateReport(report.id, "sudah_direview", comment)
                                                if (res.status === "success" || res.success) {
                                                    toast.success("Evaluasi berhasil disimpan dan disetujui")
                                                    if (onSuccess) onSuccess()
                                                    onClose()
                                                } else {
                                                    toast.error(res.message || "Gagal menyimpan evaluasi")
                                                }
                                            } catch {
                                                toast.error("Terjadi kesalahan saat menyimpan evaluasi")
                                            } finally {
                                                setIsSubmitting(false)
                                            }
                                        }}
                                    >
                                        {isSubmitting ? "Menyimpan Evaluasi..." : "Simpan & Konfirmasi Persetujuan"}
                                    </Button>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>

                    </div>
                </div>
            </DialogContent>

            {/* Modal Zoom Preview Foto Bukti */}
            <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-[800px] p-4 bg-white rounded-3xl border-slate-200 shadow-2xl">
                    <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b">
                        <DialogTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                            <ImageIcon className="size-4 text-blue-700" />
                            Foto Dokumentasi Kegiatan
                        </DialogTitle>
                        {imgSrc && (
                            <button
                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                                onClick={() => window.open(imgSrc, '_blank')}
                            >
                                <ExternalLink className="size-3.5" />
                                <span>Buka Asli</span>
                            </button>
                        )}
                    </DialogHeader>
                    <div className="relative w-full aspect-[4/3] md:aspect-[16/10] max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-slate-100 mt-2">
                        {imgSrc && (
                            <Image
                                src={imgSrc}
                                alt="Foto Bukti Ukuran Penuh"
                                fill
                                className="object-contain"
                                sizes="800px"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </Dialog>
    )
}
