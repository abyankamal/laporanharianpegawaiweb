"use client"

import * as React from "react"
import { KeyRound, Eye, EyeOff, ShieldAlert, Check } from "lucide-react"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Employee, resetEmployeePassword } from "@/lib/api/employees"

interface ResetPasswordModalProps {
    isOpen: boolean
    onClose: () => void
    employee: Employee | null
    onSuccess?: () => void
}

export function ResetPasswordModal({
    isOpen,
    onClose,
    employee,
    onSuccess,
}: ResetPasswordModalProps) {
    const [newPassword, setNewPassword] = React.useState("password123")
    const [showPassword, setShowPassword] = React.useState(false)
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (isOpen) {
            setNewPassword("password123")
            setShowPassword(false)
        }
    }, [isOpen])

    if (!employee) return null

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword.length < 8) {
            toast.error("Password minimal 8 karakter")
            return
        }

        setLoading(true)
        try {
            const res = await resetEmployeePassword(employee.id, newPassword)
            if (res.success || (res as any).status === "success") {
                toast.success(`Password untuk ${employee.nama} berhasil direset!`)
                if (onSuccess) onSuccess()
                onClose()
            } else {
                toast.error(res.message || "Gagal mereset password")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Terjadi kesalahan saat mereset password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px]">
                <form onSubmit={handleReset}>
                    <DialogHeader className="space-y-2 pb-2">
                        <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-1">
                            <KeyRound className="size-5" />
                        </div>
                        <DialogTitle className="text-lg font-bold">Reset Password Pegawai</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                            Atur ulang kata sandi pegawai yang bersangkutan. Pegawai dapat menggunakan kata sandi baru ini untuk login.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-3">
                        {/* Info Pegawai */}
                        <div className="p-3 bg-muted/40 rounded-xl border space-y-1">
                            <div className="text-xs font-semibold text-foreground">{employee.nama}</div>
                            <div className="text-[11px] text-muted-foreground">NIP: {employee.nip}</div>
                            <div className="text-[11px] text-muted-foreground">
                                Jabatan: {employee.jabatan?.nama_jabatan || "-"} ({employee.role})
                            </div>
                        </div>

                        {/* Input Password Baru */}
                        <div className="space-y-2">
                            <Label htmlFor="new_password" className="text-xs font-semibold">
                                Password Baru
                            </Label>
                            <div className="relative">
                                <Input
                                    id="new_password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan password baru (min 8 karakter)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pr-10 text-sm"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Tombol Cepat Default */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground text-[11px]">Saran default:</span>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-[11px] gap-1"
                                onClick={() => setNewPassword("password123")}
                            >
                                <Check className="size-3" />
                                Gunakan "password123"
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="pt-2 border-t flex flex-col-reverse sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="w-full sm:w-auto text-xs"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5"
                        >
                            {loading ? "Memproses..." : "Simpan Password Baru"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
