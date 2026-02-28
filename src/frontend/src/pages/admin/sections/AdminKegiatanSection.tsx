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
import { Calendar, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../../backend";
import {
  type Kegiatan,
  useAddKegiatan,
  useAllKegiatan,
  useDeleteKegiatan,
  useUpdateKegiatan,
} from "../../../hooks/useQueries";
import { Variant_upcoming_done_ongoing } from "../../../hooks/useQueries";
import {
  dateToNano,
  formatDateShort,
  nanoToDateInput,
} from "../../../utils/dateUtils";

type StatusValue = Variant_upcoming_done_ongoing;

const statusOptions: { value: StatusValue; label: string }[] = [
  { value: Variant_upcoming_done_ongoing.upcoming, label: "Akan Datang" },
  { value: Variant_upcoming_done_ongoing.ongoing, label: "Sedang Berlangsung" },
  { value: Variant_upcoming_done_ongoing.done, label: "Selesai" },
];

const statusColors = {
  [Variant_upcoming_done_ongoing.upcoming]: "bg-blue-100 text-blue-700",
  [Variant_upcoming_done_ongoing.ongoing]: "bg-green-100 text-green-700",
  [Variant_upcoming_done_ongoing.done]: "bg-gray-100 text-gray-600",
};

const emptyForm = {
  judul: "",
  deskripsi: "",
  tanggal: "",
  lokasi: "",
  status: Variant_upcoming_done_ongoing.upcoming as StatusValue,
};

export default function AdminKegiatanSection() {
  const { data: kegiatan = [], isLoading } = useAllKegiatan();
  const addKegiatan = useAddKegiatan();
  const updateKegiatan = useUpdateKegiatan();
  const deleteKegiatan = useDeleteKegiatan();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Kegiatan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleOpen = (item?: Kegiatan) => {
    if (item) {
      setEditItem(item);
      setForm({
        judul: item.judul,
        deskripsi: item.deskripsi,
        tanggal: nanoToDateInput(item.tanggal),
        lokasi: item.lokasi,
        status: item.status,
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
    if (!form.judul || !form.tanggal) {
      toast.error("Harap lengkapi judul dan tanggal.");
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

      const data: Kegiatan = {
        id: editItem?.id || crypto.randomUUID(),
        judul: form.judul,
        deskripsi: form.deskripsi,
        tanggal: dateToNano(form.tanggal),
        lokasi: form.lokasi,
        status: form.status,
        fotoId,
      };

      if (editItem) {
        await updateKegiatan.mutateAsync({ id: editItem.id, data });
        toast.success("Kegiatan berhasil diperbarui!");
      } else {
        await addKegiatan.mutateAsync(data);
        toast.success("Kegiatan berhasil ditambahkan!");
      }
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan kegiatan.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteKegiatan.mutateAsync(deleteId);
      toast.success("Kegiatan berhasil dihapus.");
      setDeleteId(null);
    } catch {
      toast.error("Gagal menghapus kegiatan.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy">
            Kegiatan
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola agenda dan program kegiatan
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kegiatan
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : kegiatan.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada data kegiatan. Klik "Tambah Kegiatan" untuk memulai.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Judul</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kegiatan.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium text-sm line-clamp-1">
                      {item.judul}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDateShort(item.tanggal)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.lokasi || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[item.status]} text-xs`}>
                      {statusOptions.find((o) => o.value === item.status)
                        ?.label || item.status}
                    </Badge>
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
              {editItem ? "Edit Kegiatan" : "Tambah Kegiatan"}
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
                    <Calendar className="w-6 h-6 text-muted-foreground/30" />
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
              <Label className="text-sm mb-1.5 block">Judul *</Label>
              <Input
                value={form.judul}
                onChange={(e) =>
                  setForm((p) => ({ ...p, judul: e.target.value }))
                }
                placeholder="Nama kegiatan..."
              />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Deskripsi</Label>
              <Textarea
                value={form.deskripsi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, deskripsi: e.target.value }))
                }
                placeholder="Keterangan kegiatan..."
                rows={3}
                className="resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm mb-1.5 block">Tanggal *</Label>
                <Input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tanggal: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, status: v as StatusValue }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Lokasi</Label>
              <Input
                value={form.lokasi}
                onChange={(e) =>
                  setForm((p) => ({ ...p, lokasi: e.target.value }))
                }
                placeholder="Aula, Lab Komputer, Online..."
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
                uploading || addKegiatan.isPending || updateKegiatan.isPending
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
            <AlertDialogTitle>Hapus Kegiatan?</AlertDialogTitle>
            <AlertDialogDescription>
              Data kegiatan ini akan dihapus permanen.
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
