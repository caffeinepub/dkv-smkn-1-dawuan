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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowDown,
  ArrowUp,
  Edit,
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
  type HeroSlide,
  useHeroSlides,
  useSaveHeroSlides,
} from "../../../hooks/useHeroSlides";

const emptyForm = {
  judul: "",
  deskripsi: "",
};

export default function AdminBerandaSection() {
  const { data: slides = [], isLoading } = useHeroSlides();
  const { mutateAsync: saveSlides, isPending: isSaving } = useSaveHeroSlides();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [existingFotoUrl, setExistingFotoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setFotoFile(null);
    setFotoPreview(null);
    setExistingFotoUrl("");
    setEditingId(null);
    setOpen(true);
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setForm({ judul: slide.judul, deskripsi: slide.deskripsi });
    setFotoFile(null);
    setFotoPreview(null);
    setExistingFotoUrl(slide.fotoUrl);
    setEditingId(slide.id);
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
    if (!form.judul.trim()) {
      toast.error("Harap masukkan judul slide.");
      return;
    }
    if (!editingId && !fotoFile && !existingFotoUrl) {
      toast.error("Harap pilih gambar untuk slide.");
      return;
    }

    setUploading(true);
    try {
      let fotoUrl = existingFotoUrl;

      if (fotoFile) {
        const bytes = new Uint8Array(await fotoFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        fotoUrl = blob.getDirectURL();
      }

      let updatedSlides: HeroSlide[];

      if (editingId) {
        updatedSlides = slides.map((s) =>
          s.id === editingId
            ? {
                ...s,
                judul: form.judul.trim(),
                deskripsi: form.deskripsi.trim(),
                fotoUrl,
              }
            : s,
        );
      } else {
        const newSlide: HeroSlide = {
          id: crypto.randomUUID(),
          judul: form.judul.trim(),
          deskripsi: form.deskripsi.trim(),
          fotoUrl,
          urutan:
            slides.length > 0
              ? Math.max(...slides.map((s) => s.urutan)) + 1
              : 0,
        };
        updatedSlides = [...slides, newSlide];
      }

      await saveSlides(updatedSlides);

      toast.success(
        editingId
          ? "Slide berhasil diperbarui!"
          : "Slide berhasil ditambahkan!",
      );
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan slide.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const updatedSlides = slides.filter((s) => s.id !== deleteId);
      await saveSlides(updatedSlides);
      toast.success("Slide berhasil dihapus.");
    } catch {
      toast.error("Gagal menghapus slide.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleMoveSlide = async (id: string, direction: "up" | "down") => {
    const idx = slides.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= slides.length) return;

    const updated = [...slides];
    const tempUrutan = updated[idx].urutan;
    updated[idx] = { ...updated[idx], urutan: updated[newIdx].urutan };
    updated[newIdx] = { ...updated[newIdx], urutan: tempUrutan };
    updated.sort((a, b) => a.urutan - b.urutan);

    try {
      await saveSlides(updated);
    } catch {
      toast.error("Gagal mengubah urutan slide.");
    }
  };

  const currentPreview = fotoPreview || existingFotoUrl || null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy">
            Slide Hero Beranda
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola gambar dan teks yang tampil di bagian atas halaman utama
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Slide
        </Button>
      </div>

      {/* Info */}
      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">
          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin opacity-40" />
          <p className="text-sm">Memuat data slide...</p>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border rounded-xl">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-1">Belum ada slide hero</p>
          <p className="text-sm">
            Klik "Tambah Slide" untuk menambah gambar hero di halaman utama.
          </p>
          <p className="text-xs mt-2 text-muted-foreground/70">
            Jika tidak ada slide, halaman utama akan menampilkan konten default.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <Card key={slide.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-40 h-32 sm:h-auto bg-secondary shrink-0 relative overflow-hidden">
                    {slide.fotoUrl ? (
                      <img
                        src={slide.fotoUrl}
                        alt={slide.judul}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 w-6 h-6 bg-brand-navy text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-brand-navy text-base line-clamp-1">
                        {slide.judul}
                      </h3>
                      {slide.deskripsi && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {slide.deskripsi}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleMoveSlide(slide.id, "up")}
                        disabled={idx === 0 || isSaving}
                        className="h-8 w-8 p-0"
                        title="Pindah ke atas"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleMoveSlide(slide.id, "down")}
                        disabled={idx === slides.length - 1 || isSaving}
                        className="h-8 w-8 p-0"
                        title="Pindah ke bawah"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEdit(slide)}
                        className="h-8 px-3"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(slide.id)}
                        className="h-8 px-3"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? "Edit Slide Hero" : "Tambah Slide Hero"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Photo upload */}
            <div>
              <Label className="text-sm mb-2 block">
                Gambar Slide {!editingId && "*"}
              </Label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                {currentPreview ? (
                  <div className="relative">
                    <img
                      src={currentPreview}
                      alt="preview"
                      className="max-h-40 mx-auto rounded-lg object-contain"
                    />
                  </div>
                ) : (
                  <div className="py-6">
                    <ImageIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Klik untuk pilih gambar
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Disarankan ukuran 1200×500px
                    </p>
                  </div>
                )}
                <label className="cursor-pointer mt-3 block">
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <span>
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      {currentPreview ? "Ganti Gambar" : "Pilih Gambar"}
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
                placeholder="Judul slide hero..."
                className="min-h-[44px]"
              />
            </div>

            <div>
              <Label className="text-sm mb-1.5 block">Deskripsi</Label>
              <Textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deskripsi: e.target.value }))
                }
                placeholder="Deskripsi singkat untuk slide ini..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={() => void handleSave()}
              disabled={uploading || isSaving}
              className="bg-brand-navy hover:bg-brand-navy/90 text-white"
            >
              {uploading || isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : editingId ? (
                "Simpan Perubahan"
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
            <AlertDialogTitle>Hapus Slide?</AlertDialogTitle>
            <AlertDialogDescription>
              Slide ini akan dihapus permanen dari hero beranda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleDelete()}
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
