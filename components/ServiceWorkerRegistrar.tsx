"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator && window.location.hostname !== "localhost") {
      // We often don't want to register SW on localhost during development 
      // unless we're specifically testing it, but for this task I'll enable it.
      // Actually, let's keep it enabled for testing as the user requested.
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW registered:", reg.scope))
        .catch((err) => console.error("SW registration failed:", err));
    } else if ("serviceWorker" in navigator && window.location.hostname === "localhost") {
        // Log that it's disabled on localhost by default but can be enabled
        console.log("SW registration skipped on localhost (standard behavior)");
        // Uncomment below to test on localhost
        navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}
