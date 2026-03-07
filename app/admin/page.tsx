"use client"

import { useState, useEffect } from "react"
import { Users, FileText, Clock, Calendar } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const recentActivities = [
        {
            id: 1,
            name: "Budi Santoso",
            initial: "BS",
            action: "telah mengunggah Laporan Harian",
            file: "Dokumentasi_Rapat.pdf",
            time: "2 jam yang lalu",
        },
        {
            id: 2,
            name: "Siti Aminah",
            initial: "SA",
            action: "menyelesaikan tugas dari Admin",
            file: "Rekap_Keuangan_Bulan_Lalu.xlsx",
            time: "4 jam yang lalu",
        },
        {
            id: 3,
            name: "Ahmad Fauzi",
            initial: "AF",
            action: "telah mengunggah Laporan Harian",
            file: "Foto_Kegiatan_Desa.jpg",
            time: "1 hari yang lalu",
        },
        {
            id: 4,
            name: "Rina Wati",
            initial: "RW",
            action: "memperbarui profil pengguna",
            file: "",
            time: "1 hari yang lalu",
        },
    ]

    return (
        <div className="flex flex-col gap-6 font-sans">
            {/* Header Halaman */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                    Ringkasan data dan aktivitas SIOPIK Desa Sukanegla hari ini.
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
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-emerald-500 mt-1">
                            +2 orang bulan ini
                        </p>
                    </CardContent>
                </Card>

                {/* Card 2: Laporan Hari Ini */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Laporan Hari Ini</CardTitle>
                        <FileText className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            dari 24 pegawai
                        </p>
                    </CardContent>
                </Card>

                {/* Card 3: Tugas Pending */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tugas Pending</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-red-500 mt-1">
                            Perlu Perhatian
                        </p>
                    </CardContent>
                </Card>

                {/* Card 4: Jam Operasional */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jam Operasional</CardTitle>
                        <Calendar className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">08:00 - 16:00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Senin - Kamis
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Aktivitas Terbaru Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Aktivitas Terbaru</CardTitle>
                    <CardDescription>
                        Daftar aktivitas pelaporan dan tugas pegawai.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {recentActivities.map((activity, index) => (
                            <div key={activity.id}>
                                <div className="flex flex-row justify-between items-start gap-4">
                                    <div className="flex flex-row gap-4 items-start flex-1">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                {activity.initial}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm leading-none">
                                                <span className="font-semibold">{activity.name}</span> {activity.action}
                                            </p>
                                            {activity.file && (
                                                <p className="text-xs text-muted-foreground pt-1">
                                                    {activity.file}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                                        {activity.time}
                                    </div>
                                </div>
                                {index < recentActivities.length - 1 && (
                                    <Separator className="mt-6" />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
