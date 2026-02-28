import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../../backend";
import {
  type Pengajar,
  useAddPengajar,
  useAllPengajar,
  useDeletePengajar,
  useUpdatePengajar,
} from "../../../hooks/useQueries";

const emptyForm = {
  nama: "",
  jabatan: "",
  mataPelajaran: "",
  bio: "",
  urutan: "1",
};

export default function AdminPengajarSection() {
  const { data: pengajar = [], isLoading } = useAllPengajar();
  const addPengajar = useAddPengajar();
  const updatePengajar = useUpdatePengajar();
  const deletePengajar = useDeletePengajar();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Pengajar | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleOpen = (item?: Pengajar) => {
    if (item) {
      setEditItem(item);
      setForm({
        nama: item.nama,
        jabatan: item.jabatan,
        mataPelajaran: item.mataPelajaran,
        bio: item.bio,
        urutan: String(item.urutan),
      });
      const prevUrl = item.fotoId
        ? ExternalBlob.fromURL(item.fotoId).getDirectURL()
        : null;
      setFotoPreview(prevUrl);
    } else {
      setEditItem(null);
      setForm(emptyForm);
      setFotoPreview(null);
    }
    setFotoFile(null);
    setOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      const url = URL.createObjectURL(file);
      setFotoPreview(url);
    }
  };

  const handleSave = async () => {
    if (!form.nama || !form.jabatan || !form.mataPelajaran) {
      toast.error("Harap lengkapi nama, jabatan, dan mata pelajaran.");
      return;
    }

    try {
      setUploading(true);
      let fotoId = editItem?.fotoId || "";

      if (fotoFile) {
        const bytes = new Uint8Array(await fotoFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        const url = blob.getDirectURL();
        fotoId = url;
        // Upload
        await blob.getBytes(); // trigger any internal processing if needed
        // We use getDirectURL() as the stored ID
        fotoId = url;
      }

      const data: Pengajar = {
        id: editItem?.id || crypto.randomUUID(),
        nama: form.nama,
        jabatan: form.jabatan,
        mataPelajaran: form.mataPelajaran,
        bio: form.bio,
        fotoId,
        urutan: BigInt(form.urutan || "0"),
      };

      if (editItem) {
        await updatePengajar.mutateAsync({ id: editItem.id, data });
        toast.success("Data pengajar berhasil diperbarui!");
      } else {
        await addPengajar.mutateAsync(data);
        toast.success("Pengajar berhasil ditambahkan!");
      }
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan data pengajar.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePengajar.mutateAsync(deleteId);
      toast.success("Pengajar berhasil dihapus.");
      setDeleteId(null);
    } catch {
      toast.error("Gagal menghapus pengajar.");
    }
  };

  const sorted = [...pengajar].sort(
    (a, b) => Number(a.urutan) - Number(b.urutan),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy">
            Pengajar
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola data pengajar DKV
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengajar
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada pengajar. Klik "Tambah Pengajar" untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((p) => {
            const fotoUrl = p.fotoId
              ? ExternalBlob.fromURL(p.fotoId).getDirectURL()
              : null;
            return (
              <Card key={p.id} className="overflow-hidden">
                <div className="h-36 bg-gradient-to-br from-secondary to-muted relative">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={p.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="font-display font-bold text-brand-navy text-sm">
                    {p.nama}
                  </p>
                  <p className="text-xs text-muted-foreground">{p.jabatan}</p>
                  <p className="text-xs text-brand-orange mt-0.5">
                    {p.mataPelajaran}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpen(p)}
                      className="flex-1 text-xs h-7"
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(p.id)}
                      className="text-xs h-7 text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editItem ? "Edit Pengajar" : "Tambah Pengajar"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Photo upload */}
            <div>
              <Label className="text-sm mb-2 block">Foto</Label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden flex items-center justify-center border border-border">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="w-7 h-7 text-muted-foreground/40" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      Pilih Foto
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Nama Lengkap *</Label>
              <Input
                value={form.nama}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nama: e.target.value }))
                }
                placeholder="Budi Santoso, S.Pd."
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Jabatan *</Label>
              <Input
                value={form.jabatan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, jabatan: e.target.value }))
                }
                placeholder="Guru / Ketua Jurusan / Instruktur"
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Mata Pelajaran *</Label>
              <Input
                value={form.mataPelajaran}
                onChange={(e) =>
                  setForm((p) => ({ ...p, mataPelajaran: e.target.value }))
                }
                placeholder="Desain Grafis, Ilustrasi Digital..."
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) =>
                  setForm((p) => ({ ...p, bio: e.target.value }))
                }
                placeholder="Deskripsi singkat pengajar..."
                rows={3}
                className="resize-none"
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Urutan Tampil</Label>
              <Input
                type="number"
                value={form.urutan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, urutan: e.target.value }))
                }
                placeholder="1"
                min="1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                uploading || addPengajar.isPending || updatePengajar.isPending
              }
              className="bg-brand-navy hover:bg-brand-navy/90 text-white"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengajar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pengajar akan dihapus
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
