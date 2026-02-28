import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Loader2,
  LogIn,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsAdmin } from "../../hooks/useQueries";

export default function AdminPage() {
  const navigate = useNavigate();
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const [showTokenForm, setShowTokenForm] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [isClaimingAccess, setIsClaimingAccess] = useState(false);

  // Redirect to dashboard if authenticated and admin
  useEffect(() => {
    if (isAuthenticated && isAdmin === true) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === "User is already authenticated") {
        await clear();
        queryClient.clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleClaimAccess = async () => {
    if (!adminToken.trim()) return;
    setIsClaimingAccess(true);

    try {
      // Save token to sessionStorage so useActor picks it up on next login
      sessionStorage.setItem("caffeineAdminToken", adminToken.trim());
      // Logout current session
      await clear();
      queryClient.clear();
      // Re-login after a short delay so useActor reinitializes with the token
      setTimeout(() => {
        login();
      }, 500);
    } catch {
      setIsClaimingAccess(false);
    }
  };

  if (isInitializing || (isAuthenticated && checkingAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-brand-navy animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memeriksa akses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy to-brand-navy/80 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img
              src="/assets/generated/dkv-logo-transparent.dim_200x200.png"
              alt="DKV Logo"
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Admin Panel
          </h1>
          <p className="text-white/60 text-sm">DKV SMKN 1 Dawuan</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8">
            {!isAuthenticated ? (
              /* Login State */
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-navy/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Shield className="w-8 h-8 text-brand-navy" />
                </div>
                <h2 className="font-display text-xl font-bold text-brand-navy mb-2">
                  Masuk ke Admin
                </h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Masuk menggunakan Internet Identity untuk mengakses panel
                  admin
                </p>
                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-medium h-11"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Masuk dengan Internet Identity
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Hanya admin yang dapat mengakses panel ini.
                </p>
              </div>
            ) : isAdmin === false ? (
              /* Access Denied */
              <div>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-red-600 mb-2">
                    Akses Ditolak
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Akun Anda tidak memiliki hak akses sebagai admin. Silakan
                    hubungi administrator untuk mendapatkan akses.
                  </p>
                  <p className="text-xs text-muted-foreground font-mono bg-secondary p-2 rounded break-all">
                    Principal:{" "}
                    {identity?.getPrincipal().toString().slice(0, 20)}
                    ...
                  </p>
                </div>

                {/* Token claim section */}
                <div className="border border-border rounded-xl overflow-hidden mb-4">
                  <button
                    type="button"
                    onClick={() => setShowTokenForm((prev) => !prev)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      Apakah Anda admin? Masukkan token untuk mengklaim akses
                    </span>
                    {showTokenForm ? (
                      <ChevronUp className="w-4 h-4 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showTokenForm && (
                      <motion.div
                        key="token-form"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                          <div className="space-y-1.5">
                            <Label
                              htmlFor="admin-token"
                              className="text-xs text-muted-foreground"
                            >
                              Token Admin
                            </Label>
                            <Input
                              id="admin-token"
                              type="password"
                              placeholder="Masukkan token admin..."
                              value={adminToken}
                              onChange={(e) => setAdminToken(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") void handleClaimAccess();
                              }}
                              className="h-9 text-sm"
                            />
                          </div>
                          <Button
                            onClick={() => void handleClaimAccess()}
                            disabled={!adminToken.trim() || isClaimingAccess}
                            className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white h-9 text-sm"
                          >
                            {isClaimingAccess ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                                Memproses...
                              </>
                            ) : (
                              <>
                                <KeyRound className="w-3.5 h-3.5 mr-2" />
                                Klaim Akses Admin
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Keluar
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
