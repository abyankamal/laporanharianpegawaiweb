"use client"

import * as React from "react"
import { ArrowRightLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    getSupervisors,
    reassignSupervisor,
    SupervisorOption,
} from "@/lib/api/employees"
import { toast } from "sonner"

interface ReassignSupervisorModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

function formatSupervisorLabel(sup: SupervisorOption) {
    const roleLabel = sup.role.toLowerCase() === "sekertaris" ? "Sekretaris" : sup.role.toUpperCase()
    const jabatanLabel = sup.jabatan?.nama_jabatan ? ` • ${sup.jabatan.nama_jabatan}` : ""
    return `${sup.nama} (${roleLabel}${jabatanLabel})`
}

export function ReassignSupervisorModal({
    isOpen,
    onClose,
    onSuccess,
}: ReassignSupervisorModalProps) {
    const [supervisors, setSupervisors] = React.useState<SupervisorOption[]>([])
    const [loadingSupervisors, setLoadingSupervisors] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)
    const [fromSupervisorId, setFromSupervisorId] = React.useState("")
    const [toSupervisorId, setToSupervisorId] = React.useState("")

    React.useEffect(() => {
        if (!isOpen) return
        setFromSupervisorId("")
        setToSupervisorId("")

        const loadSupervisors = async () => {
            setLoadingSupervisors(true)
            try {
                const res = await getSupervisors()
                if (res.success) {
                    setSupervisors(res.data || [])
                }
            } catch (error) {
                console.error("Error fetching supervisors:", error)
                toast.error("Gagal memuat daftar pejabat/atasan")
            } finally {
                setLoadingSupervisors(false)
            }
        }
        loadSupervisors()
    }, [isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fromSupervisorId || !toSupervisorId) {
            toast.error("Pilih pejabat asal dan pejabat tujuan")
            return
        }
        if (fromSupervisorId === toSupervisorId) {
            toast.error("Pejabat asal dan pejabat tujuan tidak boleh sama")
            return
        }

        setSubmitting(true)
        try {
            const res = await reassignSupervisor({
                from_supervisor_id: Number(fromSupervisorId),
                to_supervisor_id: Number(toSupervisorId),
            })
            if (res.success) {
                const affected = res.data?.affected_rows ?? 0
                toast.success(`Berhasil memindahkan ${affected} bawahan ke pejabat baru`)
                onSuccess()
                onClose()
            } else {
                toast.error(res.message || "Gagal memindahkan bawahan")
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } }
            toast.error(err.response?.data?.message || "Gagal memindahkan supervisor bawahan")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <ArrowRightLeft className="size-4 text-blue-600" />
                        <span>Pindahkan Bawahan Pejabat</span>
                    </DialogTitle>
                    <DialogDescription>
                        Pindahkan seluruh staf bawahan secara massal dari pejabat lama ke pejabat baru (misalnya saat pergantian Sekretaris atau Kasi).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="from-supervisor">Dari Pejabat / Atasan Lama</Label>
                        <Select
                            value={fromSupervisorId}
                            onValueChange={setFromSupervisorId}
                            disabled={loadingSupervisors || submitting}
                        >
                            <SelectTrigger id="from-supervisor">
                                <SelectValue placeholder={loadingSupervisors ? "Memuat..." : "Pilih pejabat lama"} />
                            </SelectTrigger>
                            <SelectContent>
                                {supervisors.map((sup) => (
                                    <SelectItem key={sup.id} value={sup.id.toString()}>
                                        {formatSupervisorLabel(sup)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="to-supervisor">Ke Pejabat / Atasan Baru</Label>
                        <Select
                            value={toSupervisorId}
                            onValueChange={setToSupervisorId}
                            disabled={loadingSupervisors || submitting}
                        >
                            <SelectTrigger id="to-supervisor">
                                <SelectValue placeholder={loadingSupervisors ? "Memuat..." : "Pilih pejabat baru"} />
                            </SelectTrigger>
                            <SelectContent>
                                {supervisors
                                    .filter((sup) => sup.id.toString() !== fromSupervisorId)
                                    .map((sup) => (
                                        <SelectItem key={sup.id} value={sup.id.toString()}>
                                            {formatSupervisorLabel(sup)}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-800">
                        <Info className="size-4 shrink-0 mt-0.5 text-blue-600" />
                        <p>
                            Seluruh pegawai yang saat ini memiliki atasan langsung pejabat lama akan otomatis diarahkan ke pejabat baru.
                        </p>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-slate-900 hover:bg-slate-800 text-white"
                            disabled={submitting || !fromSupervisorId || !toSupervisorId}
                        >
                            {submitting ? "Memindahkan..." : "Pindahkan Bawahan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
