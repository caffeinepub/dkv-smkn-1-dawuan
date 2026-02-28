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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2, Trophy, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../../backend";
import {
  type Prestasi,
  useAddPrestasi,
  useAllPrestasi,
  useDeletePrestasi,
  useUpdatePrestasi,
} from "../../../hooks/useQueries";
import { Variant_nasional_internasional_provinsi_kabupaten_sekolah } from "../../../hooks/useQueries";

type TingkatValue = Variant_nasional_internasional_provinsi_kabupaten_sekolah;

const tingkatOptions: { value: TingkatValue; label: string }[] = [
  {
    value:
      Variant_nasional_internasional_provinsi_kabupaten_sekolah.internasional,
    label: "Internasional",
  },
  {
    value: Variant_nasional_internasional_provinsi_kabupaten_sekolah.nasional,
    label: "Nasional",
  },
  {
    value: Variant_nasional_internasional_provinsi_kabupaten_sekolah.provinsi,
    label: "Provinsi",
  },
  {
    value: Variant_nasional_internasional_provinsi_kabupaten_sekolah.kabupaten,
    label: "Kabupaten",
  },
  {
    value: Variant_nasional_internasional_provinsi_kabupaten_sekolah.sekolah,
    label: "Sekolah",
  },
];

const emptyForm = {
  judul: "",
  deskripsi: "",
  tahun: String(new Date().getFullYear()),
  tingkat:
    Variant_nasional_internasional_provinsi_kabupaten_sekolah.sekolah as TingkatValue,
  siswa: "",
};

export default function AdminPrestasiSection() {
  const { data: prestasi = [], isLoading } = useAllPrestasi();
  const addPrestasi = useAddPrestasi();
  const updatePrestasi = useUpdatePrestasi();
  const deletePrestasi = useDeletePrestasi();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Prestasi | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleOpen = (item?: Prestasi) => {
    if (item) {
      setEditItem(item);
      setForm({
        judul: item.judul,
        deskripsi: item.deskripsi,
        tahun: String(item.tahun),
        tingkat: item.tingkat,
        siswa: item.siswa,
      });
      const url = item.fotoId
        ? ExternalBlob.fromURL(item.fotoId).getDirectURL()
        : null;
      setFotoPreview(url);
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
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!form.judul || !form.tahun) {
      toast.error("Harap lengkapi judul dan tahun.");
      return;
    }
    try {
      setUploading(true);
      let fotoId = editItem?.fotoId || "";

      if (fotoFile) {
        const bytes = new Uint8Array(await fotoFile.arrayBuffer());
        const blob = ExternalBlob.fromBytes(bytes);
        fotoId = blob.getDirectURL();
      }

      const data: Prestasi = {
        id: editItem?.id || crypto.randomUUID(),
        judul: form.judul,
        deskripsi: form.deskripsi,
        tahun: BigInt(form.tahun || "0"),
        tingkat: form.tingkat,
        siswa: form.siswa,
        fotoId,
      };

      if (editItem) {
        await updatePrestasi.mutateAsync({ id: editItem.id, data });
        toast.success("Prestasi berhasil diperbarui!");
      } else {
        await addPrestasi.mutateAsync(data);
        toast.success("Prestasi berhasil ditambahkan!");
      }
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan prestasi.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePrestasi.mutateAsync(deleteId);
      toast.success("Prestasi berhasil dihapus.");
      setDeleteId(null);
    } catch {
      toast.error("Gagal menghapus prestasi.");
    }
  };

  const tingkatLabel = (v: TingkatValue) =>
    tingkatOptions.find((o) => o.value === v)?.label || v;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy">
            Prestasi
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola data prestasi siswa
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Prestasi
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : prestasi.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada data prestasi. Klik "Tambah Prestasi" untuk memulai.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Judul</TableHead>
                <TableHead>Siswa</TableHead>
                <TableHead>Tingkat</TableHead>
                <TableHead>Tahun</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prestasi.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium text-sm line-clamp-1">
                      {item.judul}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.siswa || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-secondary text-foreground text-xs">
                      {tingkatLabel(item.tingkat)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {String(item.tahun)}
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

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editItem ? "Edit Prestasi" : "Tambah Prestasi"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm mb-2 block">Foto</Label>
              <div className="flex items-center gap-3">
                <div className="w-16 h-14 rounded-lg bg-secondary border overflow-hidden flex items-center justify-center">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="prev"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Trophy className="w-6 h-6 text-muted-foreground/30" />
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
              <Label className="text-sm mb-1.5 block">Judul Prestasi *</Label>
              <Input
                value={form.judul}
                onChange={(e) =>
                  setForm((p) => ({ ...p, judul: e.target.value }))
                }
                placeholder="Juara 1 Lomba Desain Nasional..."
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Nama Siswa</Label>
              <Input
                value={form.siswa}
                onChange={(e) =>
                  setForm((p) => ({ ...p, siswa: e.target.value }))
                }
                placeholder="Ahmad Fauzi, Siti Rahma..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm mb-1.5 block">Tingkat *</Label>
                <Select
                  value={form.tingkat}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, tingkat: v as TingkatValue }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tingkatOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Tahun *</Label>
                <Input
                  type="number"
                  value={form.tahun}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tahun: e.target.value }))
                  }
                  placeholder="2024"
                  min="2000"
                  max="2099"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Deskripsi</Label>
              <Textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deskripsi: e.target.value }))
                }
                placeholder="Keterangan prestasi..."
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
              onClick={handleSave}
              disabled={
                uploading || addPrestasi.isPending || updatePrestasi.isPending
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

      {/* Delete */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Prestasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Data prestasi ini akan dihapus permanen.
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
