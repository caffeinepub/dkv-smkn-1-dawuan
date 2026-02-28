import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Lightbulb, Save, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useProfil, useUpdateProfil } from "../../../hooks/useQueries";

export default function AdminProfilSection() {
  const { data: profil, isLoading } = useProfil();
  const updateProfil = useUpdateProfil();

  const [form, setForm] = useState({
    visi: "",
    misi: "",
    tujuan: "",
  });

  useEffect(() => {
    if (profil) {
      setForm({
        visi: profil.visi || "",
        misi: profil.misi || "",
        tujuan: profil.tujuan || "",
      });
    }
  }, [profil]);

  const handleSave = async () => {
    try {
      await updateProfil.mutateAsync(form);
      toast.success("Profil berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan profil.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-brand-navy">
          Profil Jurusan
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Kelola visi, misi, dan tujuan jurusan DKV
        </p>
      </div>

      <div className="space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="w-4 h-4 text-brand-navy" />
              Visi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={form.visi}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, visi: e.target.value }))
              }
              placeholder="Masukkan visi jurusan DKV..."
              rows={4}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4 text-brand-orange" />
              Misi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Pisahkan setiap poin misi dengan baris baru
            </Label>
            <Textarea
              value={form.misi}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, misi: e.target.value }))
              }
              placeholder="Misi 1&#10;Misi 2&#10;Misi 3..."
              rows={6}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="w-4 h-4 text-green-600" />
              Tujuan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="text-xs text-muted-foreground mb-2 block">
              Pisahkan setiap tujuan dengan baris baru
            </Label>
            <Textarea
              value={form.tujuan}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, tujuan: e.target.value }))
              }
              placeholder="Tujuan 1&#10;Tujuan 2&#10;Tujuan 3..."
              rows={6}
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          disabled={updateProfil.isPending}
          className="bg-brand-navy hover:bg-brand-navy/90 text-white w-full sm:w-auto"
        >
          {updateProfil.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan Profil
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
