"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Building2,
  FileCheck2,
  Clock,
  MapPin,
  Check
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "@/lib/api/auth"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [nip, setNip] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await login(nip, password)

      if (res.status === "success") {
        toast.success("Login Berhasil", {
          description: "Selamat datang kembali di Admin Panel SIOPIK"
        })
        router.push("/admin")
        router.refresh()
      } else {
        setError(res.message || "NIP atau kata sandi yang Anda masukkan salah.")
        toast.error("Login Gagal", {
          description: res.message || "Silakan periksa kembali NIP dan kata sandi Anda."
        })
      }
    } catch (err) {
      console.error(err)
      setError("Gagal terhubung ke server. Pastikan server backend sedang aktif.")
      toast.error("Error", {
        description: "Gagal terhubung ke server backend"
      })
    } finally {
      setLoading(false)
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header Resmi */}
      <header className="w-full bg-white border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative size-10 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo SIOPIK"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-slate-900 text-sm sm:text-base leading-none">
                  SIOPIK
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Panel Admin
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium mt-0.5">
                Kelurahan Sukanegla • Kecamatan Garut Kota • Kabupaten Garut
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Kolom Kiri: Informasi Sistem & Identitas Instansi (7 Kolom) */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-between space-y-8 pr-4">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                <Building2 className="size-3.5 text-slate-600" />
                <span>Pemerintah Daerah Kabupaten Garut</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
                  Sistem Optimalisasi Pelaporan Individu dan Kinerja
                </h1>
                <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                  Portal terpadu untuk monitoring pelaporan aktivitas kerja harian, verifikasi kehadiran presensi berbasis geofencing, serta evaluasi akuntabilitas kinerja aparatur sipil Kelurahan Sukanegla.
                </p>
              </div>

              {/* Tiga Pilar Layanan */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-1.5">
                  <div className="size-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <FileCheck2 className="size-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Pelaporan Harian Akurat</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    Pencatatan kegiatan harian dengan dokumentasi foto dan validasi koordinat pelaksanaan.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-1.5">
                  <div className="size-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <MapPin className="size-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Presensi & Geofencing</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    Pencatatan presensi masuk dan pulang dalam radius kantor yang telah ditetapkan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Card Formulir Login (5 Kolom) */}
          <div className="w-full lg:col-span-5 max-w-md mx-auto">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/50 rounded-2xl p-6 sm:p-8">

              <div className="mb-6 space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Masuk ke Akun Admin
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Gunakan NIP dan kata sandi yang telah terdaftar untuk melanjutkan.
                </p>
              </div>

              {/* Form Login */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Pesan Error */}
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                    <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Input NIP */}
                <div className="space-y-1.5">
                  <label htmlFor="nip" className="text-xs font-semibold text-slate-700 block">
                    Nomor Induk Pegawai (NIP)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="size-4" />
                    </div>
                    <Input
                      id="nip"
                      type="text"
                      placeholder="Masukkan 18 Digit NIP"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      className="pl-10 h-11 bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 rounded-xl placeholder:text-slate-400 transition-all font-mono"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Input Kata Sandi */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-semibold text-slate-700 block">
                      Kata Sandi
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="size-4" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-white border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm text-slate-900 rounded-xl placeholder:text-slate-400 transition-all"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                      disabled={loading}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Tombol Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-700/10 hover:shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Memverifikasi...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk ke Dashboard</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Bawah */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p className="text-[11px] text-slate-400">
            Sistem Informasi Optimalisasi Pelaporan Individu dan Kinerja (SIOPIK)
          </p>
          <p suppressHydrationWarning>
            © {currentYear} Pemerintah Kelurahan Sukanegla, Kecamatan Garut Kota, Kabupaten Garut.
          </p>
        </div>
      </footer>
    </div>
  )
}
