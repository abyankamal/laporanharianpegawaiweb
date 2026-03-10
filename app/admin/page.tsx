"use client"

import { BACKEND_URL, UPLOADS_URL } from "@/lib/api-config"

import { useState, useEffect } from "react"
import { Users, FileText, Clock, Calendar, AlertCircle, CalendarCheck, FileBadge } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { getDashboardSummary, DashboardData } from "@/lib/api/dashboard"

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
                // If it's an authentication/authorization error, logout and redirect to login
                if (response.message === "User tidak terautentikasi" ||
                    response.message === "Role tidak ditemukan" ||
                    response.message?.includes("Token tidak valid") ||
                    response.message?.includes("kadal")) {
                    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
                    window.location.href = '/'
                    return;
                }
                setError(response.message || "Gagal mengambil data")
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

    // Format date string to relative time or locale string
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.round(diffMs / 60000)
        const diffHours = Math.round(diffMs / 3600000)
        const diffDays = Math.round(diffMs / 86400000)

        if (diffMins < 60) return `${diffMins} menit yang lalu`
        if (diffHours < 24) return `${diffHours} jam yang lalu`
        if (diffDays === 1) return `Kemarin`
        return `${diffDays} hari yang lalu`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }

    // Function to get initials
    const getInitials = (name: string) => {
        if (!name) return "??"
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    }

    if (loading) {
        return <div className="flex h-[50vh] items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-muted-foreground">Memuat data dashboard...</p>
            </div>
        </div>
    }

    if (error) {
        return <div className="p-6">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    }

    const stats = dashboardData?.statistik || {
        total_pegawai: 0, laporan_masuk: 0, tepat_waktu: 0, lembur: 0
    }

    return (
        <div className="flex flex-col gap-6 font-sans">
            {/* Header Halaman */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                    Ringkasan data dan aktivitas SIOPIK Kelurahan Sukanegla hari ini.
                </p>
            </div>

            {/* Kartu Metrik Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Card 1: Total Pegawai */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pegawai</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_pegawai}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Akun Aktif
                        </p>
                    </CardContent>
                </Card>

                {/* Card 2: Laporan Masuk Hari Ini */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Laporan Masuk</CardTitle>
                        <FileText className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.laporan_masuk}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Hari Ini
                        </p>
                    </CardContent>
                </Card>

                {/* Card 3: Tepat Waktu */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tepat Waktu</CardTitle>
                        <Clock className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.tepat_waktu}</div>
                        <p className="text-xs text-emerald-600 mt-1">
                            Sesuai Jam Kerja
                        </p>
                    </CardContent>
                </Card>

                {/* Card 4: Lembur */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lembur</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.lembur}</div>
                        <p className="text-xs text-orange-500 mt-1">
                            Di Luar Jam Kerja
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Aktivitas Terbaru Section (Takes 2 columns on medium screens) */}
                <Card className="md:col-span-2 flex flex-col h-full">
                    <CardHeader>
                        <CardTitle>Aktivitas Laporan Terbaru</CardTitle>
                        <CardDescription>
                            Daftar {dashboardData?.laporan_terbaru?.length || 0} laporan terakhir yang diunggah hari ini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {(!dashboardData?.laporan_terbaru || dashboardData.laporan_terbaru.length === 0) ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                                <FileBadge className="h-8 w-8 mb-2 opacity-20" />
                                <p>Belum ada laporan yang masuk hari ini.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {dashboardData.laporan_terbaru.map((laporan, index) => (
                                    <div key={laporan.id}>
                                        <div className="flex flex-row justify-between items-start gap-4">
                                            <div className="flex flex-row gap-4 items-start flex-1">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                        {getInitials(laporan.user?.nama)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm leading-none">
                                                        <span className="font-semibold">{laporan.user?.nama || "Unknown User"}</span> mengubah status menjadi <span className="font-medium inline-flex whitespace-nowrap">{laporan.is_overtime ? "Lembur" : "Tepat Waktu"}</span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground pt-1">
                                                        Keterangan: {laporan.deskripsi_hasil || "Tidak ada keterangan"}
                                                    </p>
                                                    {(laporan.foto_url || laporan.dokumen_url) && (
                                                        <a href={`${BACKEND_URL}/${laporan.foto_url || laporan.dokumen_url}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline pt-1 inline-block">
                                                            Lihat Lampiran
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground whitespace-nowrap mt-0.5" title={formatDate(laporan.waktu_pelaporan)}>
                                                {formatTimeAgo(laporan.waktu_pelaporan)}
                                            </div>
                                        </div>
                                        {index < dashboardData.laporan_terbaru.length - 1 && (
                                            <Separator className="mt-6" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Agenda Organisasi Section (Takes 1 column) */}
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarCheck className="h-5 w-5 text-purple-600" />
                            Agenda Mendatang
                        </CardTitle>
                        <CardDescription>
                            Daftar tugas dan agenda organisasi
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {(!dashboardData?.agenda || dashboardData.agenda.length === 0) ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                                <p>Tidak ada agenda mendatang.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dashboardData.agenda.map((agendaItem) => (
                                    <div key={agendaItem.id} className="p-3 rounded-lg border bg-card/50 shadow-sm border-l-4 border-l-purple-500">
                                        <h4 className="text-sm font-semibold line-clamp-1" title={agendaItem.judul}>
                                            {agendaItem.judul}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2" title={agendaItem.deskripsi}>
                                            {agendaItem.deskripsi}
                                        </p>
                                        <div className="mt-3 flex items-center text-xs text-primary font-medium">
                                            <Clock className="mr-1 h-3 w-3" />
                                            DL: {formatDate(agendaItem.deadline)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
