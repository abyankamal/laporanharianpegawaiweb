"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, getProfile, logout as apiLogout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

interface UserContextType {
    user: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            if (res.status === "success") {
                setUser(res.data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const logout = async () => {
        await apiLogout();
        setUser(null);
        router.push("/");
        router.refresh();
    };

    return (
        <UserContext.Provider value={{ user, loading, logout, refreshProfile: fetchProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
