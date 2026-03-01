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
import {
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../../backend";
import IDCardPrint from "../../../components/IDCardPrint";
import {
  type Siswa,
  Status,
  useAddSiswa,
  useAllSiswa,
  useDeleteSiswa,
  useUpdateSiswa,
} from "../../../hooks/useQueries";

const KELAS_OPTIONS = [
  "X DKV 1",
  "X DKV 2",
  "XI DKV 1",
  "XI DKV 2",
  "XII DKV 1",
  "XII DKV 2",
];

const emptyForm = {
  nama: "",
  nisn: "",
  kelas: "",
  kelasCustom: "",
  angkatan: String(new Date().getFullYear()),
  jurusan: "DKV",
  alamat: "",
  status: Status.aktif as Status,
};

export default function AdminSiswaSection() {
  const { data: siswaList = [], isLoading } = useAllSiswa();
  const addSiswa = useAddSiswa();
  const updateSiswa = useUpdateSiswa();
  const deleteSiswa = useDeleteSiswa();

  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Siswa | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [printSiswa, setPrintSiswa] = useState<Siswa | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [kelasMode, setKelasMode] = useState<"preset" | "custom">("preset");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState<"semua" | Status>("semua");
  const [filterSearch, setFilterSearch] = useState("");

  const handleOpen = (item?: Siswa) => {
    if (item) {
      setEditItem(item);
      const isPreset = KELAS_OPTIONS.includes(item.kelas);
      setKelasMode(isPreset ? "preset" : "custom");
      setForm({
        nama: item.nama,
        nisn: item.nisn,
        kelas: isPreset ? item.kelas : "",
        kelasCustom: isPreset ? "" : item.kelas,
        angkatan: String(item.angkatan),
        jurusan: item.jurusan,
        alamat: item.alamat,
        status: item.status,
      });
      const prevUrl = item.fotoId
        ? ExternalBlob.fromURL(item.fotoId).getDirectURL()
        : null;
      setFotoPreview(prevUrl);
    } else {
      setEditItem(null);
      setForm(emptyForm);
      setKelasMode("preset");
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
    const resolvedKelas =
      kelasMode === "preset" ? form.kelas : form.kelasCustom;

    if (!form.nama.trim()) {
      toast.error("Nama lengkap wajib diisi.");
      return;
    }
    if (!form.nisn.trim() || form.nisn.length !== 10) {
      toast.error("NISN harus 10 digit.");
      return;
    }
    if (!resolvedKelas.trim()) {
      toast.error("Kelas wajib diisi.");
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

      const data: Siswa = {
        id: editItem?.id || crypto.randomUUID(),
        nama: form.nama.trim(),
        nisn: form.nisn.trim(),
        kelas: resolvedKelas.trim(),
        angkatan: BigInt(form.angkatan || String(new Date().getFullYear())),
        jurusan: form.jurusan.trim() || "DKV",
        alamat: form.alamat.trim(),
        status: form.status,
        fotoId,
      };

      if (editItem) {
        await updateSiswa.mutateAsync({ id: editItem.id, data });
        toast.success("Data siswa berhasil diperbarui!");
      } else {
        await addSiswa.mutateAsync(data);
        toast.success("Siswa berhasil ditambahkan!");
      }
      setOpen(false);
    } catch {
      toast.error("Gagal menyimpan data siswa.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSiswa.mutateAsync(deleteId);
      toast.success("Siswa berhasil dihapus.");
      setDeleteId(null);
    } catch {
      toast.error("Gagal menghapus siswa.");
    }
  };

  // Filter logic
  const filtered = siswaList.filter((s) => {
    const matchStatus = filterStatus === "semua" || s.status === filterStatus;
    const search = filterSearch.toLowerCase();
    const matchSearch =
      !search ||
      s.nama.toLowerCase().includes(search) ||
      s.nisn.includes(search) ||
      s.kelas.toLowerCase().includes(search);
    return matchStatus && matchSearch;
  });

  const totalAktif = siswaList.filter((s) => s.status === Status.aktif).length;
  const totalAlumni = siswaList.filter(
    (s) => s.status === Status.alumni,
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-navy">
            Data Siswa
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Kelola data siswa aktif dan alumni DKV
          </p>
        </div>
        <Button
          onClick={() => handleOpen()}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Siswa
        </Button>
      </div>

      {/* Stats counters */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-brand-navy">
            {siswaList.length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Total Siswa</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-700">{totalAktif}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Aktif</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-700">{totalAlumni}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Alumni</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama, NISN, atau kelas..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as "semua" | Status)}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            <SelectItem value={Status.aktif}>Aktif</SelectItem>
            <SelectItem value={Status.alumni}>Alumni</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 rounded-lg w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          {siswaList.length === 0 ? (
            <p>Belum ada data siswa. Klik "Tambah Siswa" untuk memulai.</p>
          ) : (
            <p>Tidak ada siswa yang cocok dengan filter.</p>
          )}
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/40">
                <TableHead className="w-10">No</TableHead>
                <TableHead className="w-12">Foto</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead className="hidden sm:table-cell">NISN</TableHead>
                <TableHead className="hidden md:table-cell">Kelas</TableHead>
                <TableHead className="hidden lg:table-cell">Angkatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s, idx) => {
                const fotoUrl = s.fotoId
                  ? ExternalBlob.fromURL(s.fotoId).getDirectURL()
                  : null;
                return (
                  <TableRow key={s.id} className="hover:bg-secondary/20">
                    <TableCell className="text-muted-foreground text-xs">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden flex items-center justify-center border border-border">
                        {fotoUrl ? (
                          <img
                            src={fotoUrl}
                            alt={s.nama}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <GraduationCap className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm text-brand-navy leading-tight">
                        {s.nama}
                      </p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {s.nisn} &middot; {s.kelas}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground font-mono">
                      {s.nisn}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {s.kelas}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {String(s.angkatan)}
                    </TableCell>
                    <TableCell>
                      {s.status === Status.aktif ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-xs">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-300 bg-amber-50 text-xs"
                        >
                          Alumni
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPrintSiswa(s)}
                          className="h-7 w-7 p-0 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                          title="Cetak ID Card"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpen(s)}
                          className="h-7 w-7 p-0 hover:bg-secondary"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(s.id)}
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editItem ? "Edit Data Siswa" : "Tambah Siswa"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Photo upload */}
            <div>
              <Label className="text-sm mb-2 block">Foto Siswa</Label>
              <div className="flex flex-col gap-3">
                <div className="w-full max-w-[240px] aspect-[3/2] rounded-lg bg-secondary overflow-hidden flex items-center justify-center border border-border">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="w-10 h-10 text-muted-foreground/40" />
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

            {/* Nama */}
            <div>
              <Label className="text-sm mb-1.5 block">Nama Lengkap *</Label>
              <Input
                value={form.nama}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nama: e.target.value }))
                }
                placeholder="Ahmad Rizki Pratama"
              />
            </div>

            {/* NISN */}
            <div>
              <Label className="text-sm mb-1.5 block">NISN * (10 digit)</Label>
              <Input
                value={form.nisn}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm((p) => ({ ...p, nisn: val }));
                }}
                placeholder="0012345678"
                maxLength={10}
                className="font-mono"
              />
            </div>

            {/* Kelas */}
            <div>
              <Label className="text-sm mb-1.5 block">Kelas *</Label>
              <div className="flex gap-2">
                <Select
                  value={kelasMode === "preset" ? form.kelas : "__custom__"}
                  onValueChange={(v) => {
                    if (v === "__custom__") {
                      setKelasMode("custom");
                      setForm((p) => ({ ...p, kelas: "" }));
                    } else {
                      setKelasMode("preset");
                      setForm((p) => ({ ...p, kelas: v }));
                    }
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {KELAS_OPTIONS.map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom__">Isi Manual...</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {kelasMode === "custom" && (
                <Input
                  value={form.kelasCustom}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, kelasCustom: e.target.value }))
                  }
                  placeholder="Contoh: X DKV 3"
                  className="mt-2"
                />
              )}
            </div>

            {/* Angkatan */}
            <div>
              <Label className="text-sm mb-1.5 block">
                Tahun Masuk (Angkatan)
              </Label>
              <Input
                type="number"
                value={form.angkatan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, angkatan: e.target.value }))
                }
                placeholder="2024"
                min="2000"
                max="2100"
              />
            </div>

            {/* Jurusan */}
            <div>
              <Label className="text-sm mb-1.5 block">Jurusan</Label>
              <Input
                value={form.jurusan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, jurusan: e.target.value }))
                }
                placeholder="DKV"
              />
            </div>

            {/* Alamat */}
            <div>
              <Label className="text-sm mb-1.5 block">Alamat</Label>
              <Textarea
                value={form.alamat}
                onChange={(e) =>
                  setForm((p) => ({ ...p, alamat: e.target.value }))
                }
                placeholder="Jl. Contoh No. 1, Dawuan, Karawang"
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <Label className="text-sm mb-2 block">Status</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, status: Status.aktif }))
                  }
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    form.status === Status.aktif
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-background text-muted-foreground border-border hover:bg-secondary"
                  }`}
                >
                  Aktif
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, status: Status.alumni }))
                  }
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    form.status === Status.alumni
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-background text-muted-foreground border-border hover:bg-secondary"
                  }`}
                >
                  Alumni
                </button>
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
                uploading || addSiswa.isPending || updateSiswa.isPending
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

      {/* ID Card Print Modal */}
      {printSiswa && (
        <IDCardPrint siswa={printSiswa} onClose={() => setPrintSiswa(null)} />
      )}

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Siswa?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data siswa akan dihapus
              secara permanen.
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
