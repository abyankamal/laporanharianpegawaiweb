"use client"

import * as React from "react"
import { TriangleAlert, AlertCircle, Trash2 } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    itemName: string
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
}: DeleteConfirmModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader className="flex flex-col items-center gap-2 text-center sm:text-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                        <TriangleAlert className="size-8 text-red-600 dark:text-red-500" />
                    </div>
                    <AlertDialogTitle className="text-xl font-bold">
                        Hapus Data Pegawai
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                        Apakah Anda yakin ingin menghapus data pegawai{" "}
                        <span className="font-bold text-foreground">{itemName}</span>?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="my-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600 dark:text-red-500" />
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">
                            Tindakan ini tidak dapat dibatalkan dan semua data terkait pegawai ini
                            akan dihapus secara permanen dari sistem.
                        </p>
                    </div>
                </div>

                <AlertDialogFooter className="sm:justify-between sm:space-x-4">
                    <AlertDialogCancel onClick={onClose} className="flex-1 sm:mt-0">
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                        <Trash2 className="mr-2 size-4" />
                        Hapus Sekarang
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
