"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Users,
    FileText,
    CheckSquare,
    Megaphone,
    Clock,
    LogOut,
    Briefcase,
    UserCheck,
    CalendarDays,
    Award,
    Sliders,
    Building2,
    Sparkles
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@/components/UserContext"

const navGroups = [
    {
        label: "Operasional Harian",
        items: [
            {
                title: "Dashboard",
                url: "/admin",
                icon: LayoutDashboard,
            },
            {
                title: "Rekap Absensi",
                url: "/admin/attendance",
                icon: UserCheck,
            },
            {
                title: "Izin & Cuti",
                url: "/admin/leaves",
                icon: CalendarDays,
            },
            {
                title: "Rekap Laporan",
                url: "/admin/laporan",
                icon: FileText,
            },
        ]
    },
    {
        label: "Kinerja & Penugasan",
        items: [
            {
                title: "Pemantauan Tugas",
                url: "/admin/tugas",
                icon: CheckSquare,
            },
            {
                title: "Penilaian Kinerja",
                url: "/admin/penilaian",
                icon: Award,
            },
            {
                title: "Pusat Pengumuman",
                url: "/admin/pengumuman",
                icon: Megaphone,
            },
        ]
    },
    {
        label: "Master Data & Pengaturan",
        items: [
            {
                title: "Manajemen Pegawai",
                url: "/admin/pegawai",
                icon: Users,
            },
            {
                title: "Manajemen Jabatan",
                url: "/admin/jabatan",
                icon: Briefcase,
            },
            {
                title: "Pengaturan Sistem",
                url: "/admin/pengaturan",
                icon: Sliders,
            },
        ]
    }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { logout, user } = useUser()

    return (
        <Sidebar collapsible="icon" className="border-r border-slate-200/80 bg-slate-50/50" {...props}>
            <SidebarHeader className="p-3 border-b border-slate-200/80">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-slate-100/80 transition-colors rounded-2xl">
                            <Link href="/admin" className="flex items-center gap-3">
                                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm shrink-0">
                                    <Image
                                        src="/logo.png"
                                        alt="SIOPIK Logo"
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-xs leading-tight">
                                    <span className="truncate font-extrabold tracking-tight text-slate-900 uppercase">SIOPIK Kelurahan</span>
                                    <span className="truncate text-[10px] font-semibold text-slate-400">Sukanegla • Garut Kota</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="p-2 space-y-4">
                {navGroups.map((group) => (
                    <SidebarGroup key={group.label} className="p-0">
                        <SidebarGroupLabel className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-1">
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu className="space-y-0.5">
                                {group.items.map((item) => {
                                    const isActive = item.url === "/admin"
                                        ? pathname === "/admin"
                                        : pathname === item.url || pathname.startsWith(`${item.url}/`)
                                    
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.title}
                                                isActive={isActive}
                                                className={cn(
                                                    "relative transition-all duration-200 text-xs font-semibold rounded-xl h-9 px-3",
                                                    isActive
                                                        ? "bg-slate-900 text-white font-bold shadow-sm hover:bg-slate-800 hover:text-white"
                                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                )}
                                            >
                                                <Link href={item.url} className="flex items-center gap-2.5">
                                                    <item.icon className={cn("size-4 shrink-0", isActive ? "text-blue-400" : "text-slate-500")} />
                                                    <span className="flex-1 truncate">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter className="p-3 border-t border-slate-200/80">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-400 font-mono">
                            <span>SIOPIK v2.4</span>
                            <span className="size-2 rounded-full bg-emerald-500" title="Online" />
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
