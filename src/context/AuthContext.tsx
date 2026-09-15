import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Role } from "../types";

interface AuthState {
  role: Role | null;
  nama: string;
  login: (role: Role, nama?: string) => void;
  logout: () => void;
}

const roleNames: Record<Role, string> = {
  "Admin Aset": "Budi Santoso",
  "Petugas Lapangan": "Rian Pratama",
  Bapenda: "Siti Nuraini",
  Pimpinan: "Dr. Hendra Wijaya",
  Auditor: "Maya Kusuma",
};

const AuthContext = createContext<AuthState | undefined>(undefined);
const STORAGE_KEY = "sadt_demo_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setRole(saved as Role);
  }, []);

  const login = (r: Role) => {
    sessionStorage.setItem(STORAGE_KEY, r);
    setRole(r);
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setRole(null);
  };

  const nama = role ? roleNames[role] : "";

  return (
    <AuthContext.Provider value={{ role, nama, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
