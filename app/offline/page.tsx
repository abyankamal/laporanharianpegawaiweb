"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [status, setStatus] = useState<"offline" | "connecting" | "online">("offline");
  const [countdown, setCountdown] = useState(30);
  const [lastChecked, setLastChecked] = useState<string>("");

  const checkConnection = useCallback(async () => {
    setStatus("connecting");
    setIsRetrying(true);

    try {
      // Small timeout for smooth feedback
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const online = typeof navigator !== "undefined" ? navigator.onLine : false;

      const now = new Date();
      setLastChecked(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );

      if (online) {
        setStatus("online");
        window.location.href = "/";
      } else {
        setStatus("offline");
        setCountdown(30);
      }
    } catch {
      setStatus("offline");
      setCountdown(30);
    } finally {
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    setLastChecked(
      `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
    );

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
  const progressPercentage = ((30 - countdown) / 30) * 100;

  return (
    <>
      <style>{`
        :root {
          --canvas-bg: #FBFBFA;
          --card-bg: #FFFFFF;
          --card-subtle: #F9F9F8;
          --border-color: #EAEAEA;
          --text-primary: #111111;
          --text-secondary: #787774;
          --pastel-red-bg: #FDEBEC;
          --pastel-red-text: #9F2F2D;
          --pastel-yellow-bg: #FBF3DB;
          --pastel-yellow-text: #956400;
          --pastel-green-bg: #EDF3EC;
          --pastel-green-text: #346538;
          --font-editorial: 'Newsreader', 'Playfair Display', 'Instrument Serif', Georgia, serif;
          --font-sans: 'SF Pro Display', 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
          --font-mono: 'Geist Mono', 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace;
        }

        .minimalist-container {
          min-height: 100vh;
          background-color: var(--canvas-bg);
          font-family: var(--font-sans);
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.25rem;
          position: relative;
          box-sizing: border-box;
        }

        .minimalist-card {
          width: 100%;
          max-width: 540px;
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 2.25rem 2rem;
          box-sizing: border-box;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02), 0 8px 20px rgba(0, 0, 0, 0.03);
        }

        .minimalist-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          line-height: 1;
        }

        .badge-offline {
          background-color: var(--pastel-red-bg);
          color: var(--pastel-red-text);
          border: 1px solid rgba(159, 47, 45, 0.15);
        }

        .badge-connecting {
          background-color: var(--pastel-yellow-bg);
          color: var(--pastel-yellow-text);
          border: 1px solid rgba(149, 100, 0, 0.15);
        }

        .badge-online {
          background-color: var(--pastel-green-bg);
          color: var(--pastel-green-text);
          border: 1px solid rgba(52, 101, 56, 0.15);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
        }

        .heading-serif {
          font-family: var(--font-editorial);
          font-size: 2rem;
          line-height: 1.15;
          font-weight: 500;
          letter-spacing: -0.025em;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .text-desc {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1.75rem 0;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .bento-item {
          background: var(--card-subtle);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          box-sizing: border-box;
        }

        .bento-item-full {
          background: var(--card-subtle);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem 1.125rem;
          margin-bottom: 1.5rem;
          box-sizing: border-box;
        }

        .bento-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
        }

        .bento-meta {
          font-size: 0.75rem;
          line-height: 1.45;
          color: var(--text-secondary);
          margin: 0;
        }

        .mono-text {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 42px;
          background: #111111;
          color: #FFFFFF;
          border: 1px solid #111111;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
          font-family: var(--font-sans);
          text-decoration: none;
          box-sizing: border-box;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2B2B2B;
        }

        .btn-primary:active:not(:disabled) {
          transform: scale(0.98);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 42px;
          background: #FFFFFF;
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
          font-family: var(--font-sans);
          text-decoration: none;
          box-sizing: border-box;
          margin-top: 0.625rem;
        }

        .btn-secondary:hover {
          background: #F7F6F3;
          border-color: #DFDFDF;
        }

        .btn-secondary:active {
          transform: scale(0.98);
        }

        .progress-bar-bg {
          width: 100%;
          height: 3px;
          background: var(--border-color);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 8px;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--text-primary);
          transition: width 1s linear;
        }

        .footer-text {
          margin-top: 2rem;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          color: #9A9996;
          text-align: center;
          letter-spacing: 0.02em;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .bento-grid {
            grid-template-columns: 1fr;
          }
          .minimalist-card {
            padding: 1.5rem 1.25rem;
          }
          .heading-serif {
            font-size: 1.625rem;
          }
        }
      `}</style>

      <div className="minimalist-container">
        <main className="minimalist-card">
          {/* Top Brand & Status Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.75rem",
              paddingBottom: "1.25rem",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  border: "1px solid var(--border-color)",
                  background: "var(--card-subtle)",
                  overflow: "hidden",
                }}
              >
                {/* Embedded safe image with SVG fallback for pure offline reliability */}
                <img
                  src="/logo.png"
                  alt="SIOPIK Logo"
                  width="20"
                  height="20"
                  style={{ objectFit: "contain", display: "block" }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                SIOPIK
              </span>
            </div>

            {/* Status Badge */}
            {status === "offline" && (
              <span className="minimalist-badge badge-offline">
                <span className="status-dot" />
                Offline
              </span>
            )}
            {status === "connecting" && (
              <span className="minimalist-badge badge-connecting">
                <span className="status-dot" />
                Memeriksa
              </span>
            )}
            {status === "online" && (
              <span className="minimalist-badge badge-online">
                <span className="status-dot" />
                Tersambung
              </span>
            )}
          </div>

          {/* Heading & Context */}
          <h1 className="heading-serif">Koneksi Terputus</h1>
          <p className="text-desc">
            Sistem tidak dapat menjangkau server aplikasi. Periksa jaringan internet perangkat Anda atau tunggu percobaan koneksi ulang otomatis.
          </p>

          {/* Bento Diagnostic Grid */}
          <div className="bento-grid">
            <div className="bento-item">
              <p className="bento-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
                </svg>
                Jaringan Lokal
              </p>
              <p className="bento-meta">
                Pastikan Wi-Fi atau data seluler dalam kondisi aktif.
              </p>
            </div>

            <div className="bento-item">
              <p className="bento-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2" />
                  <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2" />
                </svg>
                Status Server
              </p>
              <p className="bento-meta">
                Layanan mungkin sedang melakukan sinkronisasi berkala.
              </p>
            </div>
          </div>

          {/* Full-width Auto Retry Status */}
          <div className="bento-item-full">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)" }}>
                Mencoba Ulang Otomatis
              </span>
              <span className="mono-text">
                {String(countdown).padStart(2, "0")}s
              </span>
            </div>
            <p className="bento-meta" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Pemeriksaan berkala aktif</span>
              {lastChecked && <span className="mono-text">Terakhir: {lastChecked}</span>}
            </p>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          {/* Actions */}
          <button
            type="button"
            onClick={checkConnection}
            disabled={isRetrying}
            className="btn-primary"
          >
            {isRetrying ? (
              <>
                <svg className="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span>Menghubungkan...</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
                <span>Coba Hubungkan Sekarang</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn-secondary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Kembali ke Halaman Utama</span>
          </button>
        </main>

        {/* Minimalist Footer */}
        <footer className="footer-text">
          SIOPIK · PEMERINTAH KELURAHAN SUKANEGLA © {currentYear}
        </footer>
      </div>
    </>
  );
}

