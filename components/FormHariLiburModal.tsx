"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Save } from "lucide-react"
import { DateRange } from "react-day-picker"

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import { createHoliday } from "@/lib/api/settings"

interface FormHariLiburModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
}

export function FormHariLiburModal({
    isOpen,
    onClose,
    onSave,
}: FormHariLiburModalProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(undefined)
    const [keterangan, setKeterangan] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Reset form when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setDate(undefined)
            setKeterangan("")
            setError(null)
        }
    }, [isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!date?.from) {
            setError("Silakan pilih tanggal")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await createHoliday({
                tanggal_mulai: format(date.from, "yyyy-MM-dd"),
                tanggal_selesai: format(date.to || date.from, "yyyy-MM-dd"),
                keterangan,
            })

            if (res.status === "success") {
                onSave()
            } else {
                setError(res.message || "Gagal menyimpan hari libur")
            }
        } catch (err) {
            console.error(err)
            setError("Terjadi kesalahan saat menghubungi server")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper to format date text
    const formatButtonText = () => {
        if (!date) return <span>Pilih Tanggal</span>
        if (date.from) {
            if (!date.to) {
                return format(date.from, "dd MMM yyyy")
            } else if (date.to) {
                return `${format(date.from, "dd MMM yyyy")} - ${format(date.to, "dd MMM yyyy")}`
            }
        }
        // Should not hit here if handled correctly by DateRange
        return <span>Pilih Tanggal</span>
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Tambah Hari Libur</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        Pilih tanggal tunggal atau rentang hari libur dan masukkan keterangannya.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                        {/* Baris 1: Rentang Tanggal */}
                        <div className="space-y-2 flex flex-col">
                            <Label>Tanggal Libur <span className="text-red-500">*</span></Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formatButtonText()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    {/* Wrapping calendar in overflow-x-auto allows it to scroll horizontally on small mobile screens if 2 months are forced */}
                                    <div className="overflow-x-auto max-w-[100vw] sm:max-w-none">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            defaultMonth={date?.from}
                                            selected={date}
                                            onSelect={setDate}
                                            numberOfMonths={2}
                                            className="pointer-events-auto"
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Baris 2: Keterangan */}
                        <div className="space-y-2">
                            <Label htmlFor="keterangan">Keterangan / Nama Libur <span className="text-red-500">*</span></Label>
                            <Input
                                id="keterangan"
                                placeholder="Misal: Cuti Bersama Hari Raya Idul Fitri"
                                value={keterangan}
                                onChange={(e) => setKeterangan(e.target.value)}
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                            >
                                {isSubmitting ? "Menyimpan..." : (
                                    <>
                                        <Save className="size-4" />
                                        <span>Simpan Hari Libur</span>
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
