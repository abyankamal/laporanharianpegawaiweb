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
    Briefcase
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

const navItems = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
    },
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
        title: "Rekap Laporan",
        url: "/admin/laporan",
        icon: FileText,
    },
    {
        title: "Pemantauan Tugas",
        url: "/admin/tugas",
        icon: CheckSquare,
    },
    {
        title: "Pusat Pengumuman",
        url: "/admin/pengumuman",
        icon: Megaphone,
    },
    {
        title: "Pengaturan Waktu",
        url: "/admin/pengaturan",
        icon: Clock,
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { logout } = useUser()

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
                                    <span className="truncate text-xs font-medium text-muted-foreground">Kelurahan Sukanegla</span>
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
                            {navItems.map((item) => {
                                const isActive = pathname === item.url || (item.url !== "/admin" && pathname.startsWith(item.url))
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            isActive={isActive}
                                            className={cn(
                                                "relative transition-all duration-200",
                                                "hover:bg-primary/5 hover:text-primary",
                                                isActive ? "bg-primary/10 text-primary font-bold shadow-sm" : "text-muted-foreground"
                                            )}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className={cn("size-4", isActive && "text-primary")} />
                                                <span className="flex-1">{item.title}</span>
                                                {isActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                            onClick={() => logout()}
                        >
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
