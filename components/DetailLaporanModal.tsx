"use client"

import * as React from "react"
import {
    FileText,
    Calendar,
    Clock,
    CheckSquare,
    Image as ImageIcon,
    User
} from "lucide-react"

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

interface LaporanData {
    nama: string
    jabatan: string
    nip: string
    tanggal: string
    jam: string
    statusWaktu: string
    statusReview: string
    deskripsi: string
    fotoUrl: string
}

interface DetailLaporanModalProps {
    isOpen: boolean
    onClose: () => void
    data: LaporanData | null
}

export function DetailLaporanModal({
    isOpen,
    onClose,
    data,
}: DetailLaporanModalProps) {
    if (!data) return null

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
                                <AvatarImage src={`/avatars/${data.nip}.png`} alt={data.nama} />
                                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                    {data.nama.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-1 right-1 size-3.5 rounded-full border-2 border-background bg-green-500 shadow-sm" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold leading-none">{data.nama}</h3>
                            <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400 leading-none">
                                {data.jabatan}
                            </p>
                            <p className="mt-1.5 text-xs font-medium text-muted-foreground/80 font-mono">
                                NIP: {data.nip}
                            </p>
                        </div>
                    </div>

                    {/* Grid Informasi Waktu & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                Tanggal Laporan
                            </span>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Calendar className="size-4 text-muted-foreground" />
                                {data.tanggal}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                Jam Lapor
                            </span>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Clock className="size-4 text-muted-foreground" />
                                {data.jam} WIB
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
                                        data.statusWaktu === "Tepat Waktu"
                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400"
                                    )}
                                >
                                    {data.statusWaktu}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                Status Review
                            </span>
                            <div>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "px-2.5 py-0.5 font-bold flex items-center gap-1.5 w-fit border-transparent",
                                        data.statusReview === "Disetujui"
                                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                    )}
                                >
                                    <span className={cn(
                                        "size-2 rounded-full",
                                        data.statusReview === "Disetujui" ? "bg-blue-600" : "bg-slate-400"
                                    )} />
                                    {data.statusReview}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Bagian Deskripsi Tugas */}
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <CheckSquare className="size-4 text-blue-600" />
                            Deskripsi Tugas
                        </h4>
                        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 dark:bg-slate-900/40 dark:border-slate-800/60">
                            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                {data.deskripsi}
                            </p>
                        </div>
                    </div>

                    {/* Bagian Foto Bukti */}
                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <ImageIcon className="size-4 text-blue-600" />
                            Foto Pendukung / Bukti Kerja
                        </h4>
                        <div className="relative aspect-video overflow-hidden rounded-xl border shadow-sm">
                            <img
                                src={data.fotoUrl}
                                alt="Bukti Kerja"
                                className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        Tutup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
