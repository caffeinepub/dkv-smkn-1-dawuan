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
import { Badge } from "@/components/ui/badge";
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
  Image as ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../../backend";
import {
  type Galeri,
  useAddGaleri,
  useAllGaleri,
  useDeleteGaleri,
} from "../../../hooks/useQueries";
import { nowNano } from "../../../utils/dateUtils";

const emptyForm = {
  judul: "",
  deskripsi: "",
  kategori: "",
};

export default function AdminGaleriSection() {
  const { data: galeri = [], isLoading } = useAllGaleri();
  const addGaleri = useAddGaleri();
  const deleteGaleri = useDeleteGaleri();

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleOpen = () => {
    setForm(emptyForm);
    setFotoFile(null);
    setFotoPreview(null);
    setOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!form.judul) {
      toast.error("Harap masukkan judul foto.");
      return;
    }
    try {
      setUploading(true);
      let fotoId = "";

      if (fotoFile) {
        const bytes = new Uint8Array(await fotoFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        fotoId = blob.getDirectURL();
      }

      const data: Galeri = {
        id: crypto.randomUUID(),
        judul: form.judul,
        deskripsi: form.deskripsi,
        kategori: form.kategori,
        fotoId,
        tanggalUpload: nowNano(),
      };

      await addGaleri.mutateAsync(data);
      toast.success("Foto berhasil ditambahkan ke galeri!");
      setOpen(false);
    } catch {
      toast.error("Gagal menambahkan foto.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGaleri.mutateAsync(deleteId);
      toast.success("Foto berhasil dihapus.");
      setDeleteId(null);
    } catch {
      toast.error("Gagal menghapus foto.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy">
            Galeri
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola foto galeri karya siswa
          </p>
        </div>
        <Button
          onClick={handleOpen}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Foto
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : galeri.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada foto di galeri. Klik "Tambah Foto" untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {galeri.map((item) => {
            const fotoUrl = item.fotoId
              ? ExternalBlob.fromURL(item.fotoId).getDirectURL()
              : null;
            return (
              <Card key={item.id} className="overflow-hidden group">
                <div className="aspect-square bg-secondary relative">
                  {fotoUrl ? (
                    <img
                      src={fotoUrl}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(item.id)}
                      className="text-xs"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-xs font-medium text-foreground truncate">
                    {item.judul}
                  </p>
                  {item.kategori && (
                    <Badge className="text-xs mt-1 bg-secondary text-muted-foreground">
                      {item.kategori}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              Tambah Foto Galeri
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Photo upload */}
            <div>
              <Label className="text-sm mb-2 block">Foto *</Label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                {fotoPreview ? (
                  <img
                    src={fotoPreview}
                    alt="preview"
                    className="max-h-40 mx-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="py-6">
                    <ImageIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Klik untuk pilih foto
                    </p>
                  </div>
                )}
                <label className="cursor-pointer mt-2 block">
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <span>
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      {fotoPreview ? "Ganti Foto" : "Pilih Foto"}
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
              <Label className="text-sm mb-1.5 block">Judul *</Label>
              <Input
                value={form.judul}
                onChange={(e) =>
                  setForm((p) => ({ ...p, judul: e.target.value }))
                }
                placeholder="Nama/judul foto..."
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Kategori</Label>
              <Input
                value={form.kategori}
                onChange={(e) =>
                  setForm((p) => ({ ...p, kategori: e.target.value }))
                }
                placeholder="Desain Grafis, Fotografi, Ilustrasi..."
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Deskripsi</Label>
              <Textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deskripsi: e.target.value }))
                }
                placeholder="Keterangan foto..."
                rows={2}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={uploading || addGaleri.isPending}
              className="bg-brand-navy hover:bg-brand-navy/90 text-white"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Upload...
                </>
              ) : (
                "Tambahkan"
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
            <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Foto ini akan dihapus permanen dari galeri.
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
