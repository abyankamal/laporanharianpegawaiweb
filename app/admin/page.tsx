"use client"

import { BACKEND_URL } from "@/lib/api-config"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    Users,
    FileText,
    Clock,
    Calendar,
    AlertCircle,
    CalendarCheck,
    FileBadge,
    ArrowUpRight,
    Award,
    CheckCircle2,
    Building2,
    CalendarDays,
    ChevronRight,
    TrendingUp,
    ExternalLink,
    ShieldCheck,
    ArrowRight,
    FileCheck2,
    Briefcase
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { getDashboardSummary, DashboardData } from "@/lib/api/dashboard"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

    useEffect(() => {
        setMounted(true)
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const response = await getDashboardSummary()

            if (response.success) {
                setDashboardData(response.data)
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
                setError(response.message || "Gagal mengambil data dashboard")
            }
        } catch (err: unknown) {
            console.error("Error fetching dashboard data:", err)
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan jaringan."
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    if (!mounted) return null

    const formatTimeAgo = (dateString: string) => {
        try {
            const date = new Date(dateString)
            const now = new Date()
            const diffMs = now.getTime() - date.getTime()
            const diffMins = Math.round(diffMs / 60000)
            const diffHours = Math.round(diffMs / 3600000)
            const diffDays = Math.round(diffMs / 86400000)

            if (diffMins < 1) return "Baru saja"
            if (diffMins < 60) return `${diffMins}m lalu`
            if (diffHours < 24) return `${diffHours}j lalu`
            if (diffDays === 1) return "Kemarin"
            return `${diffDays} hari lalu`
        } catch {
            return dateString
        }
    }

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd MMMM yyyy, HH:mm", { locale: localeID })
        } catch {
            return dateString
        }
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

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="size-10 rounded-full border-2 border-slate-300 border-t-blue-700 animate-spin" />
                    <p className="text-xs font-semibold text-slate-500">Memuat data eksekutif...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert variant="destructive" className="rounded-2xl border-red-200">
                    <AlertCircle className="size-4" />
                    <AlertTitle>Gagal Memuat Data</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    const stats = dashboardData?.statistik || {
        total_pegawai: 0,
        laporan_masuk: 0,
        tepat_waktu: 0,
        lembur: 0,
    }

    const complianceRate =
        stats.total_pegawai > 0
            ? Math.min(100, Math.round((stats.laporan_masuk / stats.total_pegawai) * 100))
            : 0

    const todayDateFormatted = format(new Date(), "EEEE, dd MMMM yyyy", { locale: localeID })

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-1 sm:p-2 selection:bg-blue-600 selection:text-white">
            
            {/* Header: Eyebrow + Executive Typography + Action Islands */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                        <span className="size-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        <span>Sistem Operasional Aktif</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">{todayDateFormatted}</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Ringkasan Eksekutif
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Pantau tingkat kepatuhan pelaporan kerja harian, rasio presensi, dan agenda prioritas aparatur Kelurahan Sukanegla.
                    </p>
                </div>

                {/* Island Action Buttons (Button-in-Button Trailing Pattern) */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    <Link
                        href="/admin/leaves"
                        className="group inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-xs font-bold text-slate-700 hover:text-slate-900 transition-all duration-300 active:scale-[0.98]"
                    >
                        <span>Catat Cuti</span>
                        <div className="size-6 rounded-full bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-700 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                            <CalendarDays className="size-3.5" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/penilaian"
                        className="group inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 shadow-sm text-xs font-bold text-slate-700 hover:text-slate-900 transition-all duration-300 active:scale-[0.98]"
                    >
                        <span>Penilaian Kinerja</span>
                        <div className="size-6 rounded-full bg-slate-100 group-hover:bg-amber-50 group-hover:text-amber-700 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                            <Award className="size-3.5" />
                        </div>
                    </Link>

                    <Link
                        href="/admin/laporan"
                        className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98]"
                    >
                        <span>Arsip Laporan</span>
                        <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white/25">
                            <ArrowRight className="size-3.5" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Asymmetrical Bento Architecture: Hero Card (7 Cols) + Secondary Metric Tiles (5 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* 1. HERO BENTO CARD: Double-Bezel Hardware Enclosure (7 Cols) */}
                <div className="lg:col-span-7 rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                    <div className="h-full rounded-[calc(2rem-0.5rem)] bg-white p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                    Kepatuhan Aparatur Hari Ini
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                                    Aktivitas Pelaporan Kerja
                                </h2>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                                <CheckCircle2 className="size-3.5" />
                                <span>{complianceRate}% Terpenuhi</span>
                            </div>
                        </div>

                        {/* Middle Stat Display: Massive Tabular Numbers */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-4 border-y border-slate-100">
                            <div>
                                <span className="text-xs text-slate-500 block mb-1">Total Pegawai</span>
                                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                                    {stats.total_pegawai}
                                </div>
                                <span className="text-[11px] text-slate-400">Aparatur Terdaftar</span>
                            </div>

                            <div>
                                <span className="text-xs text-slate-500 block mb-1">Laporan Masuk</span>
                                <div className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-mono tracking-tight tabular-nums">
                                    {stats.laporan_masuk}
                                </div>
                                <span className="text-[11px] text-blue-600 font-medium">Terkirim Hari Ini</span>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <span className="text-xs text-slate-500 block mb-1">Belum Lapor</span>
                                <div className="text-3xl sm:text-4xl font-extrabold text-slate-400 font-mono tracking-tight tabular-nums">
                                    {Math.max(0, stats.total_pegawai - stats.laporan_masuk)}
                                </div>
                                <span className="text-[11px] text-slate-400">Menunggu Submit</span>
                            </div>
                        </div>

                        {/* Visual Ratio Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                                <span>Progres Pelaporan Terhadap Total Pegawai</span>
                                <span className="font-mono">{stats.laporan_masuk} / {stats.total_pegawai} ASN</span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
                                    style={{ width: `${complianceRate}%` }}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* 2. SECONDARY METRIC TILES: Double-Bezel (5 Cols) */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    
                    {/* Tile 1: Tepat Waktu */}
                    <div className="rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                        <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex items-center justify-between gap-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Jam Operasional
                                </span>
                                <h3 className="text-sm font-bold text-slate-900">Laporan Tepat Waktu</h3>
                                <p className="text-[11px] text-slate-500">Masuk dalam rentang jam dinas resmi</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-extrabold text-emerald-700 font-mono tracking-tight tabular-nums">
                                    {stats.tepat_waktu}
                                </div>
                                <span className="text-[10px] text-slate-400">Laporan</span>
                            </div>
                        </div>
                    </div>

                    {/* Tile 2: Lembur / Luar Jam */}
                    <div className="rounded-[1.75rem] bg-slate-100/90 border border-slate-200/90 p-1.5 shadow-sm">
                        <div className="h-full rounded-[calc(1.75rem-0.375rem)] bg-white p-5 flex items-center justify-between gap-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    Lembur / Lapangan
                                </span>
                                <h3 className="text-sm font-bold text-slate-900">Laporan di Luar Jam</h3>
                                <p className="text-[11px] text-slate-500">Penugasan khusus / aktivitas malam</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-extrabold text-amber-700 font-mono tracking-tight tabular-nums">
                                    {stats.lembur}
                                </div>
                                <span className="text-[10px] text-slate-400">Laporan</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Bottom Row: Linimasa Aktivitas Terbaru (8 Cols) + Agenda Penugasan (4 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Linimasa Laporan Terbaru (8 Cols) */}
                <div className="lg:col-span-8 rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                    <div className="rounded-[calc(2rem-0.5rem)] bg-white overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                    Linimasa Aktivitas Laporan
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Laporan harian pegawai yang baru saja diverifikasi ke dalam sistem
                                </p>
                            </div>
                            <Link
                                href="/admin/laporan"
                                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 hover:underline"
                            >
                                <span>Lihat Semua</span>
                                <ChevronRight className="size-3.5" />
                            </Link>
                        </div>

                        <div className="p-6">
                            {!dashboardData?.laporan_terbaru || dashboardData.laporan_terbaru.length === 0 ? (
                                <div className="py-12 text-center text-slate-400 space-y-2">
                                    <FileBadge className="size-8 mx-auto opacity-30" />
                                    <p className="text-xs font-medium">Belum ada laporan yang masuk hari ini.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {dashboardData.laporan_terbaru.map((laporan) => (
                                        <div
                                            key={laporan.id}
                                            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start justify-between gap-4 group"
                                        >
                                            <div className="flex items-start gap-3.5 flex-1 overflow-hidden">
                                                {/* Squircle Avatar */}
                                                <div className="size-10 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-xs font-bold text-slate-800 shrink-0 font-mono">
                                                    {getInitials(laporan.user?.nama)}
                                                </div>

                                                <div className="space-y-1 overflow-hidden">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                                                            {laporan.user?.nama || "Pegawai"}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            NIP: {laporan.user?.nip || "-"}
                                                        </span>
                                                        {laporan.is_overtime ? (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                                                Lembur
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                Tepat Waktu
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                                        {laporan.deskripsi_hasil || "Tidak ada keterangan hasil kerja"}
                                                    </p>

                                                    {(laporan.foto_url || laporan.dokumen_url) && (
                                                        <div className="pt-1">
                                                            <a
                                                                href={`${BACKEND_URL}/${laporan.foto_url || laporan.dokumen_url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                                                            >
                                                                <FileCheck2 className="size-3.5" />
                                                                <span>Lihat Dokumen Bukti</span>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-[11px] text-slate-400 font-mono shrink-0 sm:text-right" title={formatDate(laporan.waktu_pelaporan)}>
                                                {formatTimeAgo(laporan.waktu_pelaporan)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                {/* Agenda & Penugasan (4 Cols) */}
                <div className="lg:col-span-4 rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                    <div className="rounded-[calc(2rem-0.5rem)] bg-white p-6 space-y-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CalendarCheck className="size-4 text-purple-700" />
                                <h3 className="text-sm font-bold text-slate-900">Agenda & Tugas Aktif</h3>
                            </div>
                            <Link href="/admin/tugas" className="text-xs text-purple-700 hover:underline font-bold">
                                Kelola
                            </Link>
                        </div>

                        {!dashboardData?.agenda || dashboardData.agenda.length === 0 ? (
                            <div className="py-8 text-center text-xs text-slate-400">
                                Tidak ada agenda tugas mendatang.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {dashboardData.agenda.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-colors space-y-1.5"
                                    >
                                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1" title={item.judul}>
                                            {item.judul}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                            {item.deskripsi}
                                        </p>
                                        <div className="pt-1 flex items-center text-[10px] text-purple-800 font-semibold font-mono">
                                            <Clock className="size-3 mr-1 shrink-0" />
                                            <span>Batas: {formatDate(item.deadline)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <Building2 className="size-3.5 text-slate-400" />
                                Kelurahan Sukanegla
                            </span>
                            <span className="font-semibold text-slate-700">Garut Kota</span>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}
