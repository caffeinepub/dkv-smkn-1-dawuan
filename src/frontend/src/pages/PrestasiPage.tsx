import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Medal, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ExternalBlob } from "../backend";
import { useAllPrestasi } from "../hooks/useQueries";
import { Variant_nasional_internasional_provinsi_kabupaten_sekolah } from "../hooks/useQueries";

const levelMap: Record<string, { label: string; color: string }> = {
  [Variant_nasional_internasional_provinsi_kabupaten_sekolah.nasional]: {
    label: "Nasional",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  [Variant_nasional_internasional_provinsi_kabupaten_sekolah.internasional]: {
    label: "Internasional",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  [Variant_nasional_internasional_provinsi_kabupaten_sekolah.provinsi]: {
    label: "Provinsi",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  [Variant_nasional_internasional_provinsi_kabupaten_sekolah.kabupaten]: {
    label: "Kabupaten",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  [Variant_nasional_internasional_provinsi_kabupaten_sekolah.sekolah]: {
    label: "Sekolah",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
};

const filterOptions = [
  { value: "Semua", label: "Semua" },
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

export default function PrestasiPage() {
  const { data: prestasi = [], isLoading } = useAllPrestasi();
  const [filter, setFilter] = useState("Semua");

  const filtered =
    filter === "Semua"
      ? prestasi
      : prestasi.filter((p) => p.tingkat === filter);

  return (
    <div className="pt-16 min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-navy py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-brand-orange font-medium mb-2">Pencapaian</p>
            <h1 className="font-display text-4xl font-bold text-white mb-3">
              Prestasi
            </h1>
            <p className="text-white/70 max-w-2xl">
              Kebanggaan dan pencapaian siswa DKV SMKN 1 Dawuan di berbagai
              tingkatan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === opt.value
                  ? "bg-brand-navy text-white shadow-md"
                  : "bg-secondary text-foreground hover:bg-secondary/70"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Count */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-muted-foreground text-sm mb-6">
            Menampilkan <strong>{filtered.length}</strong> prestasi
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-1/3 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((p, i) => {
                  const fotoUrl = p.fotoId
                    ? ExternalBlob.fromURL(p.fotoId).getDirectURL()
                    : null;
                  const level = levelMap[p.tingkat] || {
                    label: p.tingkat,
                    color: "bg-gray-100 text-gray-700",
                  };

                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="card-hover h-full overflow-hidden">
                        {fotoUrl && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={fotoUrl}
                              alt={p.judul}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        {!fotoUrl && (
                          <div className="h-24 bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
                            <Trophy className="w-10 h-10 text-yellow-500/60" />
                          </div>
                        )}
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={`${level.color} text-xs`}>
                              <Medal className="w-3 h-3 mr-1" />
                              {level.label}
                            </Badge>
                            <span className="text-muted-foreground text-xs font-medium">
                              {String(p.tahun)}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-brand-navy text-lg mb-2 line-clamp-2">
                            {p.judul}
                          </h3>
                          {p.deskripsi && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {p.deskripsi}
                            </p>
                          )}
                          {p.siswa && (
                            <p className="text-xs text-muted-foreground">
                              👤 {p.siswa}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-muted-foreground"
              >
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">
                  {filter === "Semua"
                    ? "Belum ada data prestasi"
                    : `Belum ada prestasi tingkat ${filter}`}
                </p>
                <p className="text-sm mt-1">
                  Data prestasi akan segera ditambahkan.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
