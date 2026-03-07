"use client"

import * as React from "react"
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

interface FormJabatanModalProps {
    isOpen: boolean
    onClose: () => void
    jabatanData: { id?: number; nama: string } | null
    onSave: (data: { id?: number; nama: string }) => Promise<void>
}

export function FormJabatanModal({
    isOpen,
    onClose,
    jabatanData,
    onSave
}: FormJabatanModalProps) {
    const [nama, setNama] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        if (jabatanData) {
            setNama(jabatanData.nama)
        } else {
            setNama("")
        }
    }, [jabatanData, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!nama.trim()) return

        setLoading(true)
        try {
            await onSave({
                id: jabatanData?.id,
                nama: nama.trim()
            })
            onClose()
        } catch (error) {
            console.error("Error saving jabatan:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {jabatanData ? "Edit Jabatan" : "Tambah Jabatan"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama Jabatan</Label>
                        <Input
                            id="nama"
                            placeholder="Contoh: Staff Keuangan"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={loading || !nama.trim()}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
