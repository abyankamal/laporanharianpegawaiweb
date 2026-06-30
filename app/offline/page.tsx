"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  WifiOff, 
  RefreshCw, 
  Home, 
  CheckCircle2, 
  Server, 
  Clock,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [status, setStatus] = useState<"offline" | "connecting" | "online">("offline");
  const [countdown, setCountdown] = useState(30);

  const checkConnection = useCallback(async () => {
    setStatus("connecting");
    setIsRetrying(true);
    
    // Simulate a ping or connection check
    try {
      // Try to fetch a small resource or just check navigator.onLine
      const online = navigator.onLine;
      
      // Wait a bit to show the "connecting" state for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (online) {
        setStatus("online");
        // If back online, refresh the page to the original destination or home
        window.location.href = "/";
      } else {
        setStatus("offline");
        setCountdown(30); // Reset timer
      }
    } catch (err) {
      setStatus("offline");
      setCountdown(30);
    } finally {
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          checkConnection();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    const handleOnline = () => {
      setStatus("online");
      window.location.reload();
    };

    const handleOffline = () => {
        setStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkConnection]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="relative min-h-screen font-sans flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-50 to-blue-200 overflow-hidden px-4 py-8">
      
      {/* Background Abstract Blobs (Consistent with Login) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />

      {/* Main Glass Container */}
      <main className="relative z-10 w-full max-w-lg bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-500">
        
        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-600/20 backdrop-blur-sm shadow-sm overflow-hidden p-2">
              <Image
                src="/logo.png"
                alt="SIOPIK Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 uppercase">SIOPIK</span>
          </div>

          {/* Offline Illustration/Icon */}
          <div className="relative mb-6">
            <div className={`p-6 rounded-full ${status === 'connecting' ? 'bg-amber-100' : 'bg-red-100'} transition-colors duration-500`}>
              <WifiOff className={`h-12 w-12 ${status === 'connecting' ? 'text-amber-500' : 'text-red-500'} ${status === 'offline' ? 'animate-pulse' : ''}`} />
            </div>
            {status === 'connecting' && (
                <div className="absolute inset-0 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            {status === "offline" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">
                Offline
              </span>
            )}
            {status === "connecting" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">
                Menghubungkan...
              </span>
            )}
            {status === "online" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider">
                Tersambung
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-slate-800 leading-tight mb-3">
            Koneksi Terputus
          </h1>
          <p className="text-slate-500 leading-relaxed mb-8 max-w-sm">
            Maaf, kami tidak dapat menghubungkan Anda ke server. Periksa koneksi internet Anda atau coba lagi sebentar lagi.
          </p>

          {/* Suggestions */}
          <div className="w-full bg-white/30 rounded-2xl p-6 mb-8 border border-white/40 text-left space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-full bg-blue-100 text-blue-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Periksa Network</p>
                <p className="text-xs text-slate-500">Pastikan Wi-Fi atau Data Seluler Anda aktif.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-full bg-blue-100 text-blue-600">
                <Server className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Kapasitas Server</p>
                <p className="text-xs text-slate-500">Mungkin server sedang dalam pemeliharaan rutin.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 p-1 rounded-full bg-blue-100 text-blue-600">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Otomatis Mencoba</p>
                <p className="text-xs text-slate-500 italic">Mencoba ulang dalam {countdown} detik...</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <Button
              onClick={checkConnection}
              disabled={isRetrying}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Menghubungkan...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  <span>Coba Lagi Sekarang</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full h-12 bg-white/50 border-slate-200 hover:bg-white text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              <span>Kembali ke Halaman Login</span>
            </Button>
          </div>

        </div>
      </main>

      {/* Global Footer */}
      <div className="relative z-10 mt-8 text-center text-xs font-medium text-slate-500/80">
        Hak Cipta © {currentYear} Pemerintah Kelurahan Sukanegla.
      </div>
    </div>
  );
}
