"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, X, Upload, FileText } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { getEmployees, Employee } from "@/lib/api/employees"

export interface TugasData {
    id?: number
    judul_tugas: string
    deskripsi: string
    file_bukti?: string | null
    deadline: string | null
    assignees?: Employee[]
}

interface FormTugasModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (formData: FormData) => Promise<void>
    tugasData: TugasData | null
}

const DEFAULT_FORM_DATA = {
    judul_tugas: "",
    deskripsi: "",
}

export function FormTugasModal({
    isOpen,
    onClose,
    onSave,
    tugasData,
}: FormTugasModalProps) {
    const isEditMode = !!tugasData

    const [formData, setFormData] = React.useState(DEFAULT_FORM_DATA)
    const [deadlineDate, setDeadlineDate] = React.useState<Date | undefined>(undefined)
    const [selectedUserIds, setSelectedUserIds] = React.useState<number[]>([])
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [loadingEmployees, setLoadingEmployees] = React.useState(false)
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Fetch employees for assignment
    React.useEffect(() => {
        if (isOpen) {
            const fetchEmployees = async () => {
                setLoadingEmployees(true)
                try {
                    const response = await getEmployees({ limit: 100 })
                    if (response.success) {
                        setEmployees(response.data.list)
                    }
                } catch (error) {
                    console.error("Error fetching employees:", error)
                } finally {
                    setLoadingEmployees(false)
                }
            }
            fetchEmployees()
        }
    }, [isOpen])

    // Populate data when modal opens in edit mode
    React.useEffect(() => {
        if (isOpen) {
            if (tugasData) {
                setFormData({
                    judul_tugas: tugasData.judul_tugas || "",
                    deskripsi: tugasData.deskripsi || "",
                })

                if (tugasData.deadline) {
                    setDeadlineDate(new Date(tugasData.deadline))
                } else {
                    setDeadlineDate(undefined)
                }

                if (tugasData.assignees) {
                    setSelectedUserIds(tugasData.assignees.map(a => a.id))
                } else {
                    setSelectedUserIds([])
                }
            } else {
                setFormData(DEFAULT_FORM_DATA)
                setDeadlineDate(undefined)
                setSelectedUserIds([])
                setSelectedFile(null)
            }
        }
    }, [isOpen, tugasData])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const toggleUserSelection = (userId: number) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        )
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const data = new FormData()
            data.append('judul_tugas', formData.judul_tugas)
            data.append('deskripsi', formData.deskripsi)

            if (deadlineDate) {
                // Backend expects YYYY-MM-DD HH:mm:ss
                data.append('deadline', format(deadlineDate, "yyyy-MM-dd HH:mm:ss"))
            }

            selectedUserIds.forEach((id) => {
                data.append('target_user_ids', id.toString())
            })

            if (selectedFile) {
                data.append('file_bukti', selectedFile)
            }

            await onSave(data)
            onClose()
        } catch (error) {
            console.error("Error saving task:", error)
        } finally {
            setIsSubmitting(false)
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
                    <div className="grid gap-6 py-4">
                        {/* Judul Tugas */}
                        <div className="space-y-2">
                            <Label htmlFor="judul_tugas">Judul Tugas <span className="text-red-500">*</span></Label>
                            <Input
                                id="judul_tugas"
                                placeholder="Masukkan judul tugas"
                                value={formData.judul_tugas}
                                onChange={(e) => handleInputChange("judul_tugas", e.target.value)}
                                required
                            />
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi Detail Tugas</Label>
                            <Textarea
                                id="deskripsi"
                                placeholder="Jelaskan detail tugas yang harus diselesaikan..."
                                className="min-h-[100px]"
                                rows={4}
                                value={formData.deskripsi}
                                onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                            />
                        </div>

                        {/* Assignees (Multi-select style) */}
                        <div className="space-y-3">
                            <Label>Pilih Penanggung Jawab <span className="text-red-500">*</span></Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedUserIds.map((id) => {
                                    const user = employees.find((u) => u.id === id)
                                    return (
                                        <Badge key={id} variant="secondary" className="flex items-center gap-1 py-1 px-2 pr-1">
                                            {user?.nama || `User #${id}`}
                                            <button
                                                type="button"
                                                onClick={() => toggleUserSelection(id)}
                                                className="hover:bg-muted rounded-full p-0.5"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </Badge>
                                    )
                                })}
                                {selectedUserIds.length === 0 && (
                                    <span className="text-xs text-muted-foreground italic">Belum ada pegawai dipilih</span>
                                )}
                            </div>
                            <Select onValueChange={(val) => toggleUserSelection(parseInt(val))}>
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingEmployees ? "Memuat pegawai..." : "Tambah Pegawai..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees
                                        .filter((u) => !selectedUserIds.includes(u.id))
                                        .map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.nama} ({user.nip})
                                            </SelectItem>
                                        ))}
                                    {employees.length === 0 && !loadingEmployees && (
                                        <div className="p-2 text-center text-xs text-muted-foreground">Tidak ada pegawai tersedia</div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Deadline & File Bukti */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                <Label htmlFor="file_bukti">File Pendukung</Label>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            id="file_bukti"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full justify-start gap-2 text-muted-foreground truncate"
                                            onClick={() => document.getElementById('file_bukti')?.click()}
                                        >
                                            {selectedFile ? (
                                                <>
                                                    <FileText className="size-4 text-blue-500" />
                                                    <span className="text-foreground truncate">{selectedFile.name}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="size-4" />
                                                    <span>Pilih File</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    {selectedFile && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedFile(null)}
                                            className="shrink-0 text-red-500"
                                        >
                                            <X className="size-4" />
                                        </Button>
                                    )}
                                </div>
                                {tugasData?.file_bukti && !selectedFile && (
                                    <p className="text-[10px] text-muted-foreground italic truncate">
                                        File saat ini: {tugasData.file_bukti.split('/').pop()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-6 border-t mt-4">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isSubmitting || loadingEmployees || selectedUserIds.length === 0 || !formData.judul_tugas}
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Tugas"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
