"use client"

import { useState, useEffect } from "react"
import { Users, FileText, CheckSquare, Clock } from "lucide-react"

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Pegawai Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10 group-hover:scale-110" />
                    <div className="relative z-10 hidden sm:flex space-y-2 flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground w-full">Total Pegawai</h3>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Users className="size-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-bold tracking-tight">24</p>
                            <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">+2%</span>
                        </div>
                    </div>
                </div>

                {/* Laporan Masuk Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10 group-hover:scale-110" />
                    <div className="relative z-10 hidden sm:flex space-y-2 flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground w-full">Laporan Hari Ini</h3>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <FileText className="size-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-bold tracking-tight">12</p>
                            <span className="text-xs font-medium text-muted-foreground">dari 24 pegawai</span>
                        </div>
                    </div>
                </div>

                {/* Tugas Pending Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10 group-hover:scale-110" />
                    <div className="relative z-10 hidden sm:flex space-y-2 flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground w-full">Tugas Pending</h3>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <CheckSquare className="size-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-bold tracking-tight">5</p>
                            <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">Perlu Perhatian</span>
                        </div>
                    </div>
                </div>

                {/* Waktu Kerja Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <div className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/5 transition-all group-hover:bg-primary/10 group-hover:scale-110" />
                    <div className="relative z-10 hidden sm:flex space-y-2 flex-col">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground w-full">Jam Operasional</h3>
                            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <Clock className="size-5" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <p className="text-xl font-bold tracking-tight">08:00 - 16:00</p>
                            <span className="text-xs font-medium text-muted-foreground">Senin - Kamis</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aktivitas Terbaru Section */}
            <div className="rounded-2xl border bg-background shadow-sm overflow-hidden flex flex-col">
                <div className="border-b p-6 bg-muted/30">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary animate-pulse" />
                        Aktivitas Terbaru
                    </h3>
                </div>
                <div className="p-6">
                    <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[17px] before:w-px before:bg-border px-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative flex items-start gap-6 group">
                                <div className="absolute left-0 top-1 size-[10px] rounded-full border-2 border-background bg-primary ring-4 ring-background transition-transform group-hover:scale-125" />
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Laporan Harian Diunggah</p>
                                        <p className="text-sm text-muted-foreground">Pegawai {i} telah mengunggah laporan harian dengan lampiran <span className="font-medium text-foreground">Dokumentasi_Rapat.pdf</span></p>
                                    </div>
                                    <div className="text-xs font-medium text-muted-foreground whitespace-nowrap bg-muted px-2.5 py-1 rounded-md">
                                        {i * 2} jam yang lalu
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
