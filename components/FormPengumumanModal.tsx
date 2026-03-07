"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Send } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export interface PengumumanData {
    id?: number
    judul: string
    audience: string
    status: string
    tanggalPublish?: string // In dummy data it's "07 Mar 2026", but here we might reconstruct it
    waktuPublish?: string // e.g. "09:00"
    isi?: string // Full content of announcement
}

interface FormPengumumanModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: PengumumanData | Omit<PengumumanData, 'id'>) => void
    pengumumanData: PengumumanData | null
}

const DEFAULT_FORM_DATA = {
    judul: "",
    audience: "",
    status: "",
    waktuPublish: "",
    isi: "",
}

export function FormPengumumanModal({
    isOpen,
    onClose,
    onSave,
    pengumumanData,
}: FormPengumumanModalProps) {
    const isEditMode = !!pengumumanData

    // Base text fields
    const [formData, setFormData] = React.useState(DEFAULT_FORM_DATA)

    // Custom states for dates
    const [publishDate, setPublishDate] = React.useState<Date | undefined>(undefined)

    // Populate data when modal opens in edit mode
    React.useEffect(() => {
        if (isOpen) {
            if (pengumumanData) {
                setFormData({
                    judul: pengumumanData.judul || "",
                    audience: pengumumanData.audience || "",
                    status: pengumumanData.status || "",
                    waktuPublish: pengumumanData.waktuPublish || "08:00", // Defaulting to 08:00 if not provided
                    isi: pengumumanData.isi || "",
                })

                // Very basic string to Date parsing for the dummy format "07 Mar 2026"
                if (pengumumanData.tanggalPublish) {
                    setPublishDate(new Date()) // Simplified parsing for demo
                } else {
                    setPublishDate(undefined)
                }
            } else {
                setFormData(DEFAULT_FORM_DATA)
                setPublishDate(undefined)
            }
        }
    }, [isOpen, pengumumanData])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Format date nicely before saving
        let formattedDate = ""
        if (publishDate) {
            formattedDate = format(publishDate, "dd MMM yyyy")
        }

        const dataToSave = {
            ...formData,
            tanggalPublish: formattedDate
        }

        if (isEditMode && pengumumanData?.id) {
            onSave({ id: pengumumanData.id, ...dataToSave })
        } else {
            onSave(dataToSave)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {isEditMode ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        Informasi ini akan dikirimkan sebagai notifikasi ke aplikasi pegawai.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Baris 1: Judul */}
                        <div className="space-y-2">
                            <Label htmlFor="judul">Judul Pengumuman <span className="text-red-500">*</span></Label>
                            <Input
                                id="judul"
                                placeholder="Misal: Apel Gabungan Besok Pagi"
                                value={formData.judul}
                                onChange={(e) => handleInputChange("judul", e.target.value)}
                                required
                            />
                        </div>

                        {/* Baris 2: Target Audience & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="audience">Target Audience <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.audience}
                                    onValueChange={(val) => handleInputChange("audience", val)}
                                    required
                                >
                                    <SelectTrigger id="audience">
                                        <SelectValue placeholder="Pilih Audience" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Semua Pegawai">Semua Pegawai</SelectItem>
                                        <SelectItem value="Staff IT & Admin">Staff IT & Admin</SelectItem>
                                        <SelectItem value="Kasi & Kaur">Kasi & Kaur</SelectItem>
                                        <SelectItem value="Kepala Desa">Kepala Desa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
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
                                        <SelectItem value="Terjadwal">Terjadwal</SelectItem>
                                        <SelectItem value="Kedaluwarsa">Kedaluwarsa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Baris 3: Tanggal Publish & Waktu Publish */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label>Tanggal Publish <span className="text-red-500">*</span></Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !publishDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {publishDate ? format(publishDate, "PPP") : <span>Pilih Tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={publishDate}
                                            onSelect={setPublishDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2 flex flex-col">
                                <Label htmlFor="waktuPublish">Waktu Publish <span className="text-red-500">*</span></Label>
                                <Input
                                    id="waktuPublish"
                                    type="time"
                                    value={formData.waktuPublish}
                                    onChange={(e) => handleInputChange("waktuPublish", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Baris 4: Isi Pesan */}
                        <div className="space-y-2">
                            <Label htmlFor="isi">Isi Pengumuman <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="isi"
                                placeholder="Ketik pesan pengumuman di sini..."
                                className="min-h-[120px]"
                                rows={5}
                                value={formData.isi}
                                onChange={(e) => handleInputChange("isi", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t mt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Batal
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                            {!isEditMode && <Send className="size-4" />}
                            <span>{isEditMode ? "Simpan Perubahan" : "Publikasikan"}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
