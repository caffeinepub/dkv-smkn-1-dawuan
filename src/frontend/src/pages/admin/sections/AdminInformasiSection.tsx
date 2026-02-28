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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  EyeOff,
  Loader2,
  Newspaper,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../../backend";
import {
  type Informasi,
  useAddInformasi,
  useAllInformasi,
  useDeleteInformasi,
  useUpdateInformasi,
} from "../../../hooks/useQueries";
import { formatDateShort, nowNano } from "../../../utils/dateUtils";

const emptyForm = {
  judul: "",
  ringkasan: "",
  isi: "",
  published: false,
};

export default function AdminInformasiSection() {
  const { data: informasi = [], isLoading } = useAllInformasi();
  const addInformasi = useAddInformasi();
  const updateInformasi = useUpdateInformasi();
  const deleteInformasi = useDeleteInformasi();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Informasi | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleOpen = (item?: Informasi) => {
    if (item) {
      setEditItem(item);
      setForm({
        judul: item.judul,
        ringkasan: item.ringkasan,
        isi: item.isi,
        published: item.published,
      });
      const url = item.coverFotoId
        ? ExternalBlob.fromURL(item.coverFotoId).getDirectURL()
        : null;
      setCoverPreview(url);
    } else {
      setEditItem(null);
      setForm(emptyForm);
      setCoverPreview(null);
    }
    setCoverFile(null);
    setOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!form.judul || !form.isi) {
      toast.error("Harap lengkapi judul dan isi artikel.");
      return;
    }
    try {
      setUploading(true);
      let coverFotoId = editItem?.coverFotoId || "";

      if (coverFile) {
        const bytes = new Uint8Array(await coverFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        coverFotoId = blob.getDirectURL();
      }

      const data: Informasi = {
        id: editItem?.id || crypto.randomUUID(),
        judul: form.judul,
        ringkasan: form.ringkasan,
        isi: form.isi,
        published: form.published,
        coverFotoId,
        tanggalPublish: editItem?.tanggalPublish || nowNano(),
      };

      if (editItem) {
        await updateInformasi.mutateAsync({ id: editItem.id, data });
        toast.success("Informasi berhasil diperbarui!");
      } else {
        await addInformasi.mutateAsync(data);
        toast.success("Informasi berhasil ditambahkan!");
      }
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan informasi.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteInformasi.mutateAsync(deleteId);
      toast.success("Informasi berhasil dihapus.");
      setDeleteId(null);
    } catch {
      toast.error("Gagal menghapus informasi.");
    }
  };

  const togglePublish = async (item: Informasi) => {
    try {
      await updateInformasi.mutateAsync({
        id: item.id,
        data: { ...item, published: !item.published },
      });
      toast.success(
        item.published
          ? "Informasi disembunyikan."
          : "Informasi dipublikasikan.",
      );
    } catch {
      toast.error("Gagal mengubah status.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy">
            Informasi
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola berita dan pengumuman
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Informasi
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : informasi.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada informasi. Klik "Tambah Informasi" untuk memulai.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Judul</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {informasi.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium text-sm line-clamp-1">
                      {item.judul}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.ringkasan}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDateShort(item.tanggalPublish)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.published}
                        onCheckedChange={() => togglePublish(item)}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Badge
                        className={
                          item.published
                            ? "bg-green-100 text-green-700 border-green-200 text-xs"
                            : "bg-gray-100 text-gray-600 text-xs"
                        }
                      >
                        {item.published ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Publik
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Draft
                          </>
                        )}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpen(item)}
                        className="h-7 text-xs"
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(item.id)}
                        className="h-7 text-xs text-destructive hover:text-destructive border-destructive/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editItem ? "Edit Informasi" : "Tambah Informasi"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Cover Image */}
            <div>
              <Label className="text-sm mb-2 block">Foto Cover</Label>
              <div className="flex items-center gap-3">
                <div className="w-24 h-16 rounded-lg bg-secondary overflow-hidden flex items-center justify-center border">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Newspaper className="w-6 h-6 text-muted-foreground/30" />
                  )}
                </div>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-3.5 h-3.5 mr-1.5" />
                      Pilih Cover
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
                placeholder="Judul informasi..."
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Ringkasan</Label>
              <Textarea
                value={form.ringkasan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, ringkasan: e.target.value }))
                }
                placeholder="Ringkasan singkat artikel..."
                rows={2}
                className="resize-none"
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Isi Artikel *</Label>
              <Textarea
                value={form.isi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isi: e.target.value }))
                }
                placeholder="Tulis isi artikel di sini..."
                rows={8}
                className="resize-none"
              />
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
              <Switch
                checked={form.published}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, published: v }))
                }
                className="data-[state=checked]:bg-green-500"
              />
              <div>
                <p className="text-sm font-medium">
                  {form.published ? "Publik" : "Draft"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {form.published
                    ? "Artikel akan terlihat oleh pengunjung"
                    : "Artikel hanya terlihat di admin"}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                uploading || addInformasi.isPending || updateInformasi.isPending
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
            <AlertDialogTitle>Hapus Informasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Artikel ini akan dihapus permanen dan tidak dapat dikembalikan.
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
