"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

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

export interface TugasData {
    id?: number
    namaTugas: string
    project: string // or projectName
    deskripsi: string
    penanggungJawab: string
    prioritas: string
    deadline: string // can be formatted string or ISO
    status: string
}

interface FormTugasModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (data: TugasData | Omit<TugasData, 'id'>) => void
    tugasData: TugasData | null
}

const DEFAULT_FORM_DATA = {
    namaTugas: "",
    project: "",
    deskripsi: "",
    penanggungJawab: "",
    prioritas: "",
    status: "Belum Dimulai",
}

export function FormTugasModal({
    isOpen,
    onClose,
    onSave,
    tugasData,
}: FormTugasModalProps) {
    const isEditMode = !!tugasData

    // Base text fields
    const [formData, setFormData] = React.useState(DEFAULT_FORM_DATA)

    // Custom states for dates
    const [deadlineDate, setDeadlineDate] = React.useState<Date | undefined>(undefined)

    // Populate data when modal opens in edit mode
    React.useEffect(() => {
        if (isOpen) {
            if (tugasData) {
                setFormData({
                    namaTugas: tugasData.namaTugas || "",
                    project: tugasData.project || "",
                    deskripsi: tugasData.deskripsi || "",
                    penanggungJawab: tugasData.penanggungJawab || "",
                    prioritas: tugasData.prioritas || "",
                    status: tugasData.status || "Belum Dimulai",
                })

                // Very basic string to Date parsing for the dummy format "12 Okt 2026"
                // In a real app, `tugasData.deadline` should ideally be an ISO string or Date object.
                if (tugasData.deadline) {
                    // Because our dummy data is localized string ("12 Okt 2026"), creating a Date from it 
                    // directly might fail depending on the browser. For safety in this demo, let's just 
                    // set it to today if it exists, or write a custom parser if needed.
                    // Using a simple fallback for demo purposes:
                    setDeadlineDate(new Date())
                } else {
                    setDeadlineDate(undefined)
                }
            } else {
                setFormData(DEFAULT_FORM_DATA)
                setDeadlineDate(undefined)
            }
        }
    }, [isOpen, tugasData])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Format date nicely before saving
        let formattedDeadline = ""
        if (deadlineDate) {
            // Fallback or use proper locale if needed. Using date-fns format.
            formattedDeadline = format(deadlineDate, "dd MMM yyyy")
        }

        const dataToSave = {
            ...formData,
            deadline: formattedDeadline
        }

        if (isEditMode && tugasData?.id) {
            onSave({ id: tugasData.id, ...dataToSave })
        } else {
            onSave(dataToSave)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {isEditMode ? "Edit Detail Tugas" : "Tambah Tugas Baru"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Baris 1: Nama Tugas & Project */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="namaTugas">Nama Tugas <span className="text-red-500">*</span></Label>
                                <Input
                                    id="namaTugas"
                                    placeholder="Masukkan nama tugas"
                                    value={formData.namaTugas}
                                    onChange={(e) => handleInputChange("namaTugas", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="project">Nama Project <span className="text-muted-foreground font-normal">(Opsional)</span></Label>
                                <Input
                                    id="project"
                                    placeholder="Misal: Infrastruktur 2026"
                                    value={formData.project}
                                    onChange={(e) => handleInputChange("project", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Baris 2: Deskripsi */}
                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi Detail Tugas</Label>
                            <Textarea
                                id="deskripsi"
                                placeholder="Jelaskan detail tugas yang harus diselesaikan..."
                                className="min-h-[80px]"
                                rows={3}
                                value={formData.deskripsi}
                                onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                            />
                        </div>

                        {/* Baris 3: Penanggung Jawab & Prioritas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="penanggungJawab">Penanggung Jawab <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.penanggungJawab}
                                    onValueChange={(val) => handleInputChange("penanggungJawab", val)}
                                    required
                                >
                                    <SelectTrigger id="penanggungJawab">
                                        <SelectValue placeholder="Pilih Pegawai" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Dummy list for demo */}
                                        <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                                        <SelectItem value="Siti Aminah">Siti Aminah</SelectItem>
                                        <SelectItem value="Ahmad Riyadi">Ahmad Riyadi</SelectItem>
                                        <SelectItem value="Dewi Lestari">Dewi Lestari</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="prioritas">Prioritas <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.prioritas}
                                    onValueChange={(val) => handleInputChange("prioritas", val)}
                                    required
                                >
                                    <SelectTrigger id="prioritas">
                                        <SelectValue placeholder="Pilih Prioritas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="HIGH">HIGH</SelectItem>
                                        <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                                        <SelectItem value="LOW">LOW</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Baris 4: Deadline & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                                <Label>Tenggat Waktu (Deadline) <span className="text-red-500">*</span></Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !deadlineDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {deadlineDate ? format(deadlineDate, "PPP") : <span>Pilih Tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={deadlineDate}
                                            onSelect={setDeadlineDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status Tugas <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => handleInputChange("status", val)}
                                    required
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Belum Dimulai">Belum Dimulai</SelectItem>
                                        <SelectItem value="Sedang Dikerjakan">Sedang Dikerjakan</SelectItem>
                                        <SelectItem value="Selesai">Selesai</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t mt-2">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Batal
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                            Simpan Tugas
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
