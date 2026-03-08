import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CustomPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalData?: number
    limit?: number
    itemName?: string
}

export function CustomPagination({
    currentPage,
    totalPages,
    onPageChange,
    totalData,
    limit,
    itemName = "entri"
}: CustomPaginationProps) {
    if (totalPages <= 1 && !totalData) return null

    const renderPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    className="size-8 p-0 text-xs shadow-sm"
                    onClick={() => onPageChange(i)}
                >
                    {i}
                </Button>
            )
        }
        return pages
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
            <p className="text-xs text-muted-foreground order-2 sm:order-1">
                {totalData !== undefined && limit !== undefined ? (
                    <>
                        Menampilkan <span className="font-medium text-foreground">{totalData > 0 ? (currentPage - 1) * limit + 1 : 0}</span> sampai <span className="font-medium text-foreground">{Math.min(currentPage * limit, totalData)}</span> dari <span className="font-medium text-foreground">{totalData}</span> {itemName}
                    </>
                ) : (
                    <>
                        Halaman <span className="font-medium text-foreground">{currentPage}</span> dari <span className="font-medium text-foreground">{totalPages}</span>
                    </>
                )}
            </p>

            {totalPages > 1 && (
                <div className="flex items-center gap-1 order-1 sm:order-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                        {renderPageNumbers()}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
