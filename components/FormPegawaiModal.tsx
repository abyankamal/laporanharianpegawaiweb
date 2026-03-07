"use client"

import * as React from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface PegawaiData {
    id?: number
    nip: string
    nama: string
    jabatan: string
    role: string
    status: string
}

interface FormPegawaiModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: PegawaiData | Omit<PegawaiData, 'id'>) => void
    pegawaiData: PegawaiData | null
}

const DEFAULT_FORM_DATA = {
    nip: "",
    nama: "",
    jabatan: "",
    role: "",
    status: "",
    password: "" // password only collected internally
}

export function FormPegawaiModal({
    isOpen,
    onClose,
    onSave,
    pegawaiData,
}: FormPegawaiModalProps) {
    const isEditMode = !!pegawaiData

    const [formData, setFormData] = React.useState(DEFAULT_FORM_DATA)

    // Populate data when modal opens in edit mode
    React.useEffect(() => {
        if (isOpen) {
            if (pegawaiData) {
                setFormData({
                    nip: pegawaiData.nip,
                    nama: pegawaiData.nama,
                    jabatan: pegawaiData.jabatan,
                    role: pegawaiData.role,
                    status: pegawaiData.status,
                    password: "", // always empty on edit initially
                })
            } else {
                setFormData(DEFAULT_FORM_DATA)
            }
        }
    }, [isOpen, pegawaiData])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // In a real app, you would include logic here to pass the password 
        // to your backend if it was provided, or strip it if empty during edit.
        const dataToSave = { ...formData }
        if (isEditMode && pegawaiData?.id) {
            onSave({ id: pegawaiData.id, ...dataToSave })
        } else {
            onSave(dataToSave)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {isEditMode ? "Edit Data Pegawai" : "Tambah Pegawai Baru"}
                    </DialogTitle>
                    <DialogDescription>
                        Masukkan detail informasi pegawai di bawah ini.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Baris 1: NIP */}
                        <div className="space-y-2">
                            <Label htmlFor="nip">Nomor Induk Pegawai (NIP)</Label>
                            <Input
                                id="nip"
                                placeholder="Masukkan NIP"
                                value={formData.nip}
                                onChange={(e) => handleInputChange("nip", e.target.value)}
                                required
                            />
                        </div>

                        {/* Baris 2: Nama Lengkap */}
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Lengkap</Label>
                            <Input
                                id="nama"
                                placeholder="Masukkan Nama Lengkap"
                                value={formData.nama}
                                onChange={(e) => handleInputChange("nama", e.target.value)}
                                required
                            />
                        </div>

                        {/* Baris 3: Jabatan & Role */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="jabatan">Jabatan</Label>
                                <Input
                                    id="jabatan"
                                    placeholder="Misal: Kasi Pemerintahan"
                                    value={formData.jabatan}
                                    onChange={(e) => handleInputChange("jabatan", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role Akses</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(val) => handleInputChange("role", val)}
                                    required
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Lurah">Lurah</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Sekretaris">Sekretaris</SelectItem>
                                        <SelectItem value="Pegawai">Pegawai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Baris 4: Status & Password */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => handleInputChange("status", val)}
                                    required
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Aktif">Aktif</SelectItem>
                                        <SelectItem value="Cuti">Cuti</SelectItem>
                                        <SelectItem value="Non-Aktif">Non-Aktif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={isEditMode ? "••••••••" : "Buat Password"}
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    // Required only on Add Mode
                                    required={!isEditMode}
                                />
                                {isEditMode && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Kosongkan jika tidak diubah
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t mt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Batal
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                            Simpan Data
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
