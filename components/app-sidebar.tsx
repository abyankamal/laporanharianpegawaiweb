"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    FileText,
    CheckSquare,
    Megaphone,
    Clock,
    LogOut,
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

const navItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Manajemen Pegawai",
        url: "/pegawai",
        icon: Users,
    },
    {
        title: "Rekap Laporan",
        url: "/laporan",
        icon: FileText,
    },
    {
        title: "Pemantauan Tugas",
        url: "/tugas",
        icon: CheckSquare,
    },
    {
        title: "Pusat Pengumuman",
        url: "/pengumuman",
        icon: Megaphone,
    },
    {
        title: "Pengaturan Waktu",
        url: "/pengaturan",
        icon: Clock,
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-primary/5 transition-colors">
                            <Link href="/admin">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                                    <Image
                                        src="/logo.png"
                                        alt="SIOPIK Logo"
                                        width={28}
                                        height={28}
                                        className="drop-shadow-sm"
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight ml-1">
                                    <span className="truncate font-bold tracking-tight text-foreground uppercase">SIOPIK Admin</span>
                                    <span className="truncate text-xs font-medium text-muted-foreground">Desa Sukanegla</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        isActive={pathname === item.url}
                                        className="hover:bg-primary/5 hover:text-primary transition-all duration-200"
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="size-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <LogOut className="size-4" />
                            <span>Keluar</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
