"use client"

import * as React from "react"
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    Users,
    KeyRound,
    Building2,
    ArrowRightLeft
} from "lucide-react"

import { CustomPagination } from "@/components/CustomPagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { DeleteConfirmModal } from "@/components/DeleteConfirmModal"
import { FormPegawaiModal, FormPegawaiSaveData, PegawaiData } from "@/components/FormPegawaiModal"
import { ResetPasswordModal } from "@/components/ResetPasswordModal"
import { ReassignSupervisorModal } from "@/components/ReassignSupervisorModal"

import {
    getEmployees,
    deleteEmployee,
    createEmployee,
    updateEmployee,
    Employee
} from "@/lib/api/employees"
import { toast } from "sonner"

export default function ManajemenPegawaiPage() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false)
    const [selectedPegawai, setSelectedPegawai] = React.useState<Employee | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [employees, setEmployees] = React.useState<Employee[]>([])
    const [totalData, setTotalData] = React.useState(0)
    const [currentPage, setCurrentPage] = React.useState(1)
    const [totalPages, setTotalPages] = React.useState(1)
    const [searchTerm, setSearchTerm] = React.useState("")
    const [limit, setLimit] = React.useState(10)

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit)
        setCurrentPage(1)
    }

    // Form Modal States
    const [isFormModalOpen, setIsFormModalOpen] = React.useState(false)
    const [formModeData, setFormModeData] = React.useState<PegawaiData | null>(null)
    const [isResetModalOpen, setIsResetModalOpen] = React.useState(false)
    const [selectedResetPegawai, setSelectedResetPegawai] = React.useState<Employee | null>(null)
    const [isReassignModalOpen, setIsReassignModalOpen] = React.useState(false)

    const [selectedRole, setSelectedRole] = React.useState<string>("Semua")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")

    // Debounce search term
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 400)
        return () => clearTimeout(timer)
    }, [searchTerm])

    const fetchEmployees = React.useCallback(async () => {
        setLoading(true)
        try {
            const roleValue = selectedRole === "Sekretaris" ? "sekertaris" : selectedRole.toLowerCase()
            const response = await getEmployees({
                search: debouncedSearch,
                role: selectedRole === "Semua" ? "" : roleValue,
                page: currentPage,
                limit
            })
            const rawRes = response as unknown as { status?: string; message?: string }
            const isSuccess = response.success || rawRes.status === "success"

            if (isSuccess && response.data) {
                setEmployees(response.data.list || [])
                setTotalData(response.data.pagination?.total_data || 0)
                setTotalPages(response.data.pagination?.total_pages || 1)
            } else {
                if (
                    rawRes.message === "User tidak terautentikasi" ||
                    rawRes.message === "Role tidak ditemukan" ||
                    rawRes.message?.includes("Token tidak valid") ||
                    rawRes.message?.includes("kadal")
                ) {
                    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => { });
                    window.location.href = '/'
                    return;
                }
            }
        } catch (error) {
            console.error("Error fetching employees:", error)
            toast.error("Gagal mengambil data pegawai")
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, selectedRole, currentPage, limit])

    React.useEffect(() => {
        fetchEmployees()
    }, [fetchEmployees])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleAddPegawaiClick = () => {
        setFormModeData(null)
        setIsFormModalOpen(true)
    }

    const handleEditPegawaiClick = (item: Employee) => {
        setFormModeData({
            id: item.id,
            nip: item.nip,
            nama: item.nama,
            jabatan: item.jabatan?.nama_jabatan || "",
            jabatan_id: item.jabatan_id ?? undefined,
            supervisor_id: item.supervisor_id,
            kategori_pegawai_id: item.kategori_pegawai_id || item.kategori_pegawai?.id,
            role: item.role,
        })
        setIsFormModalOpen(true)
    }

    const handleSavePegawai = async (data: FormPegawaiSaveData) => {
        try {
            const payload = {
                nip: data.nip,
                nama: data.nama,
                role: data.role.toLowerCase(),
                jabatan_id: data.jabatan_id ? Number(data.jabatan_id) : undefined,
                supervisor_id: data.supervisor_id && String(data.supervisor_id) !== "none" ? Number(data.supervisor_id) : undefined,
                kategori_pegawai_id: data.kategori_pegawai_id ? Number(data.kategori_pegawai_id) : undefined,
                password: data.password || undefined
            }

            if (data.id) {
                await updateEmployee(data.id, payload)
                toast.success("Data pegawai berhasil diperbarui")
            } else {
                await createEmployee(payload)
                toast.success("Pegawai baru berhasil ditambahkan")
            }
            setIsFormModalOpen(false)
            fetchEmployees()
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } }
            toast.error(err.response?.data?.message || "Gagal menyimpan data pegawai")
        }
    }

    const handleDeleteClick = (pegawai: Employee) => {
        setSelectedPegawai(pegawai)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedPegawai) return
        try {
            await deleteEmployee(selectedPegawai.id)
            toast.success("Data pegawai berhasil dihapus")
            setIsDeleteModalOpen(false)
            fetchEmployees()
        } catch {
            toast.error("Gagal menghapus data pegawai")
        }
    }

    const renderKategoriBadge = (item: Employee) => {
        const namaKategori = item.kategori_pegawai?.nama_kategori || (
            item.kategori_pegawai_id === 1 ? "PNS" :
                item.kategori_pegawai_id === 2 ? "PPPK Penuh Waktu" :
                    item.kategori_pegawai_id === 3 ? "PPPK Paruh Waktu" : ""
        );
        const kode = item.kategori_pegawai?.kode_kategori || (
            item.kategori_pegawai_id === 1 ? "pns" :
                item.kategori_pegawai_id === 2 ? "p3k_penuh" :
                    item.kategori_pegawai_id === 3 ? "p3k_paruh" : ""
        );

        if (kode === "pns") {
            return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-block">{namaKategori}</span>;
        } else if (kode === "p3k_penuh") {
            return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">{namaKategori}</span>;
        } else if (kode === "p3k_paruh") {
            return <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 inline-block">{namaKategori}</span>;
        }
        return <span className="text-slate-400 font-mono text-xs">{namaKategori || "-"}</span>;
    };

    const renderRoleBadge = (role: string) => {
        const r = (role || "").toLowerCase()
        if (r === "lurah") {
            return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 inline-block">Lurah</span>
        } else if (r === "sekertaris") {
            return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 inline-block">Sekretaris</span>
        } else if (r === "kasi") {
            return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 inline-block">Kasi</span>
        }
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 inline-block">Staf</span>
    }

    const getInitials = (name: string) => {
        if (!name) return "??"
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
    }

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto p-1 sm:p-2 selection:bg-blue-600 selection:text-white">

            {/* Header: Eyebrow + Title + Add Button */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                        <Building2 className="size-3.5 text-slate-500" />
                        <span>Basis Data Aparatur Sipil</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">Kelurahan Sukanegla</span>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Manajemen Pegawai
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                        Pengelolaan akun pegawai, hak akses hierarki, pemetaan jabatan, dan kategori kepegawaian SIOPIK.
                    </p>
                </div>

                {/* Island Actions (Reassign + Add Employee Button) */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        onClick={() => setIsReassignModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm text-xs font-bold transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                        <ArrowRightLeft className="size-3.5 text-blue-600" />
                        <span>Pindahkan Bawahan</span>
                    </button>
                    <button
                        onClick={handleAddPegawaiClick}
                        className="group inline-flex items-center gap-3 pl-5 pr-2 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-md text-xs font-bold transition-all duration-300 active:scale-[0.98] cursor-pointer"
                    >
                        <span>Tambah Pegawai</span>
                        <div className="size-6 rounded-full bg-white/15 flex items-center justify-center transition-all duration-300 group-hover:rotate-90 group-hover:bg-white/25">
                            <Plus className="size-3.5" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Filter Bar: Role Pills + Search Box */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Role Filter Pills */}
                <div className="p-1 rounded-full bg-slate-100 border border-slate-200 flex items-center gap-1 flex-wrap">
                    {["Semua", "Lurah", "Sekretaris", "Kasi", "Staf"].map((role) => (
                        <button
                            key={role}
                            onClick={() => {
                                setSelectedRole(role)
                                setCurrentPage(1)
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${selectedRole === role
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                        className="w-full h-10 pl-10 pr-4 bg-white rounded-full border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 shadow-sm transition-all"
                        placeholder="Cari nama, NIP, atau jabatan..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Main Table: Double-Bezel Hardware Architecture */}
            <div className="rounded-[2rem] bg-slate-100/90 border border-slate-200/90 p-2 shadow-sm">
                <div className="rounded-[calc(2rem-0.5rem)] bg-white overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                                <TableRow>
                                    <TableHead className="w-12 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">NO</TableHead>
                                    <TableHead className="min-w-55 text-[11px] font-bold uppercase tracking-wider text-slate-500">PEGAWAI</TableHead>
                                    <TableHead className="min-w-37.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">NIP</TableHead>
                                    <TableHead className="min-w-45 text-[11px] font-bold uppercase tracking-wider text-slate-500">JABATAN</TableHead>
                                    <TableHead className="min-w-35 text-[11px] font-bold uppercase tracking-wider text-slate-500">KATEGORI</TableHead>
                                    <TableHead className="text-center min-w-25 text-[11px] font-bold uppercase tracking-wider text-slate-500">HAK AKSES</TableHead>
                                    <TableHead className="text-right min-w-30 text-[11px] font-bold uppercase tracking-wider text-slate-500">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-slate-100">
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="size-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-700" />
                                                <span className="text-xs font-semibold text-slate-500">Memuat data pegawai...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : employees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-slate-400">
                                            <div className="space-y-1">
                                                <Users className="size-6 mx-auto opacity-30" />
                                                <p className="text-xs font-medium">Tidak ada data pegawai yang cocok.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    employees.map((item, index) => (
                                        <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                                            {/* No */}
                                            <TableCell className="text-center text-xs font-mono text-slate-400">
                                                {(currentPage - 1) * limit + index + 1}
                                            </TableCell>

                                            {/* Pegawai */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                                                        {getInitials(item.nama)}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <span className="text-xs font-bold text-slate-900 block truncate">{item.nama}</span>
                                                        <span className="text-[10px] text-slate-400 font-mono block truncate">
                                                            ID: #{item.id}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* NIP */}
                                            <TableCell className="font-mono text-xs text-slate-600 font-medium">
                                                {item.nip}
                                            </TableCell>

                                            {/* Jabatan */}
                                            <TableCell className="text-xs text-slate-700 font-semibold">
                                                {item.jabatan?.nama_jabatan || "-"}
                                            </TableCell>

                                            {/* Kategori Pegawai */}
                                            <TableCell>
                                                {renderKategoriBadge(item)}
                                            </TableCell>

                                            {/* Hak Akses Role */}
                                            <TableCell className="text-center">
                                                {renderRoleBadge(item.role)}
                                            </TableCell>

                                            {/* Aksi */}
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedResetPegawai(item)
                                                            setIsResetModalOpen(true)
                                                        }}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Reset Password"
                                                    >
                                                        <KeyRound className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditPegawaiClick(item)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Edit Pegawai"
                                                    >
                                                        <Pencil className="size-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="size-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                        title="Hapus Pegawai"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="p-4 border-t border-slate-100">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalData={totalData}
                            limit={limit}
                            onLimitChange={handleLimitChange}
                            itemName="pegawai"
                        />
                    </div>

                </div>
            </div>

            {/* Modals */}
            <FormPegawaiModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                pegawaiData={formModeData}
                onSave={handleSavePegawai}
            />

            <ResetPasswordModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                employee={selectedResetPegawai}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedPegawai?.nama || "Pegawai"}
            />

            <ReassignSupervisorModal
                isOpen={isReassignModalOpen}
                onClose={() => setIsReassignModalOpen(false)}
                onSuccess={fetchEmployees}
            />

        </div>
    )
}
