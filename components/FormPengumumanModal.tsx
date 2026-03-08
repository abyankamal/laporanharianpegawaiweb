"use client"

import * as React from "react"
import { Send } from "lucide-react"

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

    // Populate data when modal opens in edit mode
    React.useEffect(() => {
        if (isOpen) {
            setError(null)
            if (pengumumanData) {
                setFormData({
                    judul: pengumumanData.judul || "",
                    audience: "Semua Pegawai", // Backend simplified logic
                    isi: pengumumanData.isi || "",
                })
            } else {
                setFormData(DEFAULT_FORM_DATA)
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
                        Informasi ini akan langsung dikirimkan ke seluruh pegawai SIOPIK.
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

                        {/* Baris 2: Target Audience */}
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
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Baris 3: Isi Pesan */}
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
