"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Loader2, Upload, X, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import { createReport } from "@/lib/api/reports"
import { toast } from "sonner"

interface CreateReportModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CreateReportModal({ isOpen, onClose, onSuccess }: CreateReportModalProps) {
    const [loading, setLoading] = React.useState(false)
    const [date, setDate] = React.useState<Date>(new Date())
    const [time, setTime] = React.useState(format(new Date(), "HH:mm"))
    const [tipeLaporan, setTipeLaporan] = React.useState("tambahan") // "pokok" atau "tambahan"
    const [judul, setJudul] = React.useState("")
    const [deskripsi, setDeskripsi] = React.useState("")
    const [alamat, setAlamat] = React.useState("")
    const [foto, setFoto] = React.useState<File | null>(null)
    const [dokumen, setDokumen] = React.useState<File | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!deskripsi) {
            toast.error("Deskripsi hasil wajib diisi")
            return
        }

        if (tipeLaporan === "tambahan" && !judul) {
            toast.error("Judul kegiatan wajib diisi")
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("tipe_laporan", tipeLaporan)
            formData.append("judul_kegiatan", judul)
            formData.append("deskripsi_hasil", deskripsi)
            formData.append("alamat_lokasi", alamat)
            
            // Format: YYYY-MM-DD HH:mm:ss
            const formattedDate = format(date, "yyyy-MM-dd")
            formData.append("waktu_pelaporan", `${formattedDate} ${time}:00`)

            if (foto) formData.append("foto", foto)
            if (dokumen) formData.append("dokumen", dokumen)

            const response = await createReport(formData)

            if (response.status === "success" || response.success) {
                toast.success("Laporan berhasil dibuat")
                resetForm()
                onSuccess()
                onClose()
            } else {
                toast.error(response.message || "Gagal membuat laporan")
            }
        } catch (error) {
            console.error("Error creating report:", error)
            toast.error("Terjadi kesalahan saat membuat laporan")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setJudul("")
        setDeskripsi("")
        setAlamat("")
        setFoto(null)
        setDokumen(null)
        setDate(new Date())
        setTime(format(new Date(), "HH:mm"))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Buat Laporan Baru</DialogTitle>
                        <DialogDescription>
                            Isi formulir di bawah ini untuk melaporkan kegiatan kinerja harian Anda.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Waktu Pelaksanaan */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Tanggal Kegiatan</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(d) => d && setDate(d)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label>Jam Kegiatan</Label>
                                <Input 
                                    type="time" 
                                    value={time} 
                                    onChange={(e) => setTime(e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Jenis Tugas */}
                        <div className="space-y-2">
                            <Label>Jenis Tugas</Label>
                            <Select value={tipeLaporan} onValueChange={setTipeLaporan}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jenis Tugas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tambahan">Tugas Individu / Khusus</SelectItem>
                                    <SelectItem value="pokok">Tugas Pokok / Organisasi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Judul */}
                        <div className="space-y-2">
                            <Label htmlFor="judul">Judul Kegiatan</Label>
                            <Input
                                id="judul"
                                placeholder="Contoh: Monitoring Posyandu, Rapat Koordinasi..."
                                value={judul}
                                onChange={(e) => setJudul(e.target.value)}
                            />
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi Hasil</Label>
                            <Textarea
                                id="deskripsi"
                                placeholder="Uraikan detail hasil kegiatan yang telah dilaksanakan..."
                                className="min-h-[100px]"
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                            />
                        </div>

                        {/* Lokasi */}
                        <div className="space-y-2">
                            <Label htmlFor="alamat" className="flex items-center gap-2">
                                <MapPin className="size-3" />
                                Alamat/Lokasi (Opsional)
                            </Label>
                            <Input
                                id="alamat"
                                placeholder="Lokasi dilaksanakannya kegiatan..."
                                value={alamat}
                                onChange={(e) => setAlamat(e.target.value)}
                            />
                        </div>

                        {/* Upload Files */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Foto Dokumentsi</Label>
                                <div className="flex flex-col gap-2">
                                    {foto ? (
                                        <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md">
                                            <span className="truncate flex-1">{foto.name}</span>
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFoto(null)}>
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Label htmlFor="foto-upload" className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                            <Upload className="h-4 w-4 mb-2 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground text-center">Pilih Foto (JPG/PNG)</span>
                                            <input 
                                                id="foto-upload" 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={(e) => e.target.files && setFoto(e.target.files[0])}
                                            />
                                        </Label>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>File Dokumen</Label>
                                <div className="flex flex-col gap-2">
                                    {dokumen ? (
                                        <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md">
                                            <span className="truncate flex-1">{dokumen.name}</span>
                                            <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDokumen(null)}>
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Label htmlFor="dokumen-upload" className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                            <Upload className="h-4 w-4 mb-2 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground text-center">Pilih Dokumen (PDF/Doc)</span>
                                            <input 
                                                id="dokumen-upload" 
                                                type="file" 
                                                accept=".pdf,.doc,.docx" 
                                                className="hidden" 
                                                onChange={(e) => e.target.files && setDokumen(e.target.files[0])}
                                            />
                                        </Label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan Laporan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
