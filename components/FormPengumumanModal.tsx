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

import { createAnnouncement, updateAnnouncement } from "@/lib/api/announcements"

export interface PengumumanData {
    id?: number
    judul: string
    audience: string
    status: string
    tanggalPublish?: string // "yyyy-MM-dd"
    waktuPublish?: string // "HH:mm"
    isi?: string // pesan
}

interface FormPengumumanModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    pengumumanData: PengumumanData | null
}

const DEFAULT_FORM_DATA = {
    judul: "",
    audience: "Semua Pegawai",
    status: "Aktif",
    waktuPublish: "08:00",
    isi: "",
}

export function FormPengumumanModal({
    isOpen,
    onClose,
    onSave,
    pengumumanData,
}: FormPengumumanModalProps) {
    const isEditMode = !!pengumumanData
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Base text fields
    const [formData, setFormData] = React.useState(DEFAULT_FORM_DATA)

    // Custom states for dates
    const [publishDate, setPublishDate] = React.useState<Date | undefined>(undefined)

    // Populate data when modal opens in edit mode
    React.useEffect(() => {
        if (isOpen) {
            setError(null)
            if (pengumumanData) {
                setFormData({
                    judul: pengumumanData.judul || "",
                    audience: pengumumanData.audience || "Semua Pegawai",
                    status: pengumumanData.status || "Aktif",
                    waktuPublish: pengumumanData.waktuPublish || "08:00",
                    isi: pengumumanData.isi || "",
                })

                if (pengumumanData.tanggalPublish) {
                    setPublishDate(new Date(pengumumanData.tanggalPublish))
                } else {
                    setPublishDate(new Date())
                }
            } else {
                setFormData(DEFAULT_FORM_DATA)
                setPublishDate(new Date())
            }
        }
    }, [isOpen, pengumumanData])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const payload = {
                judul: formData.judul,
                pesan: formData.isi,
                audience: formData.audience
            }

            let response
            if (isEditMode && pengumumanData?.id) {
                response = await updateAnnouncement(pengumumanData.id, payload)
            } else {
                response = await createAnnouncement(payload)
            }

            if (response.success) {
                onSave()
            } else {
                setError(response.message)
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal menyimpan pengumuman")
            console.error(err)
        } finally {
            setIsSubmitting(false)
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

                    <DialogFooter className="pt-4 border-t mt-2 flex flex-col gap-4">
                        {error && (
                            <div className="w-full p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm mb-2">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-end gap-3 w-full">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin mr-1">⏳</span>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        {!isEditMode && <Send className="size-4" />}
                                        <span>{isEditMode ? "Simpan Perubahan" : "Publikasikan"}</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
