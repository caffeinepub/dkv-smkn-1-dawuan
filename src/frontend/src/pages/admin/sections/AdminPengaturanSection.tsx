import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../../hooks/useActor";
import { useAdminAuth } from "../../../hooks/useAdminAuth";

export default function AdminPengaturanSection() {
  const { actor } = useActor();
  const { sessionToken } = useAdminAuth();

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername.trim()) {
      toast.error("Username tidak boleh kosong.");
      return;
    }
    if (!newPassword.trim()) {
      toast.error("Password tidak boleh kosong.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }
    if (!actor || !sessionToken) {
      toast.error("Sesi tidak valid. Silakan login ulang.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await actor.setAdminCredentials(
        newUsername.trim(),
        newPassword,
        sessionToken,
      );
      if (result.__kind__ === "ok") {
        toast.success(
          "Kredensial berhasil diperbarui! Silakan login ulang dengan kredensial baru.",
        );
        setNewUsername("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.err || "Gagal memperbarui kredensial.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-brand-navy">
          Pengaturan Akun
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Ubah username dan password untuk akses admin
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="w-4 h-4 text-brand-navy" />
            Ubah Kredensial Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void handleSave(e)} className="space-y-4">
            {/* New Username */}
            <div className="space-y-1.5">
              <Label htmlFor="new-username" className="text-sm font-medium">
                Username Baru
              </Label>
              <Input
                id="new-username"
                type="text"
                placeholder="Masukkan username baru"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                autoComplete="username"
                className="h-10"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-sm font-medium">
                Password Baru
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-sm font-medium">
                Konfirmasi Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showConfirm ? "Sembunyikan password" : "Tampilkan password"
                  }
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  Password tidak cocok.
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={
                  isSaving ||
                  !newUsername.trim() ||
                  !newPassword.trim() ||
                  !confirmPassword.trim()
                }
                className="bg-brand-navy hover:bg-brand-navy/90 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-100">
              <KeyRound className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-xs text-amber-700">
                <p className="font-medium mb-0.5">Informasi Penting</p>
                <p>
                  Setelah mengubah kredensial, Anda perlu login ulang
                  menggunakan username dan password baru. Pastikan Anda
                  mengingat kredensial baru sebelum menyimpan.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
