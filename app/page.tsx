"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login logic, then redirect
    router.push("/admin")
  }

  const currentYear = new Date().getFullYear()

  return (
    <div className="relative min-h-screen font-sans flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200 overflow-hidden px-4 py-8">

      {/* Background Abstract Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />

      {/* Main Glass Container */}
      <main className="relative z-10 w-full max-w-5xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row">

        {/* Left Column - Branding */}
        <div className="lg:w-1/2 p-10 lg:p-12 relative flex flex-col justify-between overflow-hidden">
          {/* Background overlay for left column to ensure text readability */}
          <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-md z-0" />

          <div className="relative z-10 flex flex-col h-full">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-sm overflow-hidden p-2">
                <Image
                  src="/logo.png"
                  alt="SIOPIK Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white uppercase">SIOPIK</span>
            </div>

            {/* Title & Description */}
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                Sistem Optimalisasi Pelaporan Individu dan Kinerja
              </h1>
              <p className="text-lg text-blue-100/80 leading-relaxed max-w-md">
                Kelola data kinerja dan pelaporan administrasi dengan aman, cepat, dan transparan dalam satu platform.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="lg:w-1/2 p-10 lg:p-12 flex flex-col justify-center bg-white/20">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Selamat Datang Kembali</h2>
              <p className="text-slate-600 mt-2 text-sm">
                Silakan masuk ke akun Anda untuk melanjutkan akses panel admin.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 block">NIP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Masukkan Username atau NIP"
                    className="pl-10 h-12 bg-white/50 border-white/60 focus:bg-white/80 focus:ring-blue-500/50 shadow-sm backdrop-blur-sm transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 block">Kata Sandi</label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12 bg-white/50 border-white/60 focus:bg-white/80 focus:ring-blue-500/50 shadow-sm backdrop-blur-sm transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Masuk ke Panel Admin
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

          </div>
        </div>
      </main>

      {/* Global Footer */}
      <div className="relative z-10 mt-8 text-center text-xs font-medium text-slate-500/80" suppressHydrationWarning>
        Hak Cipta © {currentYear} Pemerintah Kelurahan Sukanegla.
      </div>
    </div>
  )
}
