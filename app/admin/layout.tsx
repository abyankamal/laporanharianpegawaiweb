"use client"

import * as React from "react"
import { Bell, LogOut, Settings, User } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UserProvider, useUser } from "@/components/UserContext"
import { usePathname } from "next/navigation"

function AdminHeader() {
    const { user, logout } = useUser();
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const getPageTitle = (path: string) => {
        const segments = path.split('/').filter(Boolean);
        const lastSegment = segments[segments.length - 1];

        switch (lastSegment) {
            case 'admin': return 'Dashboard';
            case 'pegawai': return 'Data Pegawai';
            case 'jabatan': return 'Data Jabatan';
            case 'tugas': return 'Pemantauan Tugas';
            case 'pengumuman': return 'Pusat Pengumuman';
            case 'laporan': return 'Rekap Laporan';
            case 'pengaturan': return 'Pengaturan';
            default: return 'Dashboard';
        }
    }

    return (
        <header className="flex-shrink-0 border-b bg-background/95 backdrop-blur sticky top-0 z-20 flex h-16 items-center justify-between gap-2 px-4 shadow-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/admin">
                                Admin
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{getPageTitle(pathname)}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex items-center gap-4">

                {mounted && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent transition-all hover:ring-primary/20 focus-visible:ring-primary">
                                <Avatar className="h-9 w-9 text-xs">
                                    <AvatarImage src={user?.foto_path || "/avatars/admin.png"} alt={user?.nama || "Admin"} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {user?.nama?.substring(0, 2).toUpperCase() || "AD"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.nama || "Admin Sukanegla"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.nip || "admin@sukanegla.desa.id"}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profil</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Pengaturan</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                onClick={() => logout()}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Keluar</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <UserProvider>
            <TooltipProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <div className="flex flex-col w-full h-screen overflow-hidden">
                        <AdminHeader />
                        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/10">
                            {children}
                        </main>
                        <footer className="flex-shrink-0 border-t bg-white p-4 text-center text-sm text-muted-foreground">
                            Hak Cipta © 2026 SIOPIK - <strong>Kelurahan Sukanegla</strong>
                        </footer>
                    </div>
                </SidebarProvider>
            </TooltipProvider>
        </UserProvider>
    )
}
