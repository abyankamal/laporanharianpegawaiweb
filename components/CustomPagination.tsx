import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CustomPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalData?: number
    limit?: number
    itemName?: string
    onLimitChange?: (limit: number) => void
    pageSizeOptions?: number[]
}

export function CustomPagination({
    currentPage,
    totalPages,
    onPageChange,
    totalData,
    limit,
    itemName = "entri",
    onLimitChange,
    pageSizeOptions
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
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4 w-full">
            {/* Left: Page Size Selector */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground order-3 sm:order-1 sm:flex-1 justify-center sm:justify-start">
                {onLimitChange && (
                    <>
                        <span>Tampilkan</span>
                        <Select value={String(limit || 10)} onValueChange={(val) => onLimitChange(Number(val))}>
                            <SelectTrigger className="h-8 w-[70px] text-xs bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {(pageSizeOptions ?? [10, 25, 50, 100]).map(opt => (
                                    <SelectItem key={opt} value={String(opt)}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>data</span>
                    </>
                )}
            </div>

            {/* Middle: Pagination Controls */}
            <div className="flex items-center gap-1 order-1 sm:order-2 sm:flex-1 justify-center">
                {totalPages > 1 && (
                    <>
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
                    </>
                )}
            </div>

            {/* Right: Info Text */}
            <div className="text-xs text-muted-foreground order-2 sm:order-3 sm:flex-1 text-center sm:text-right">
                {totalData !== undefined && limit !== undefined ? (
                    <>
                        <span className="font-medium text-foreground">{totalData > 0 ? (currentPage - 1) * limit + 1 : 0}</span> - <span className="font-medium text-foreground">{Math.min(currentPage * limit, totalData)}</span> dari <span className="font-medium text-foreground">{totalData}</span> {itemName}
                    </>
                ) : (
                    <>
                        Halaman <span className="font-medium text-foreground">{currentPage}</span> dari <span className="font-medium text-foreground">{totalPages}</span>
                    </>
                )}
            </div>
        </div>
    )
}
