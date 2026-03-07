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
import { getJabatans, Jabatan } from "@/lib/api/employees"

export interface PegawaiData {
    id?: number
    nip: string
    nama: string
    jabatan?: string
    jabatan_id?: number
    role: string
}

interface FormPegawaiModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: any) => void
    pegawaiData: PegawaiData | null
}

const DEFAULT_FORM_DATA = {
    nip: "",
    nama: "",
    jabatan_id: "",
    role: "",
    password: ""
}

export function FormPegawaiModal({
    isOpen,
    onClose,
    onSave,
    pegawaiData,
}: FormPegawaiModalProps) {
    const isEditMode = !!pegawaiData
    const [formData, setFormData] = React.useState(DEFAULT_FORM_DATA)
    const [jabatans, setJabatans] = React.useState<Jabatan[]>([])
    const [loadingJabatans, setLoadingJabatans] = React.useState(false)

    // Fetch jabatans on mount
    React.useEffect(() => {
        const fetchJabatans = async () => {
            setLoadingJabatans(true)
            try {
                const response = await getJabatans()
                if (response.success) {
                    setJabatans(response.data)
                }
            } catch (error) {
                console.error("Error fetching jabatans:", error)
            } finally {
                setLoadingJabatans(false)
            }
        }

        if (isOpen) {
            fetchJabatans()
        }
    }, [isOpen])

    // Populate data when modal opens in edit mode
    React.useEffect(() => {
        if (isOpen) {
            if (pegawaiData) {
                setFormData({
                    nip: pegawaiData.nip,
                    nama: pegawaiData.nama,
                    jabatan_id: pegawaiData.jabatan_id?.toString() || "",
                    role: pegawaiData.role.toLowerCase(),
                    password: "",
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
        const dataToSave = {
            ...formData,
            id: pegawaiData?.id
        }
        onSave(dataToSave)
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
                                <Select
                                    value={formData.jabatan_id}
                                    onValueChange={(val) => handleInputChange("jabatan_id", val)}
                                    required
                                >
                                    <SelectTrigger id="jabatan">
                                        <SelectValue placeholder={loadingJabatans ? "Memuat..." : "Pilih Jabatan"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {jabatans.map((j) => (
                                            <SelectItem key={j.id} value={j.id.toString()}>
                                                {j.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                        <SelectItem value="lurah">Lurah</SelectItem>
                                        <SelectItem value="sekertaris">Sekretaris</SelectItem>
                                        <SelectItem value="kasi">Kasi</SelectItem>
                                        <SelectItem value="staf">Staf</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Baris 4: Password (Full Width) */}
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
