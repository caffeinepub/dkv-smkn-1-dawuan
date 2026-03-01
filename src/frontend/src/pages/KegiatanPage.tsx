import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ExternalBlob } from "../backend";
import { useAllKegiatan } from "../hooks/useQueries";
import { Variant_upcoming_done_ongoing } from "../hooks/useQueries";
import { formatDate } from "../utils/dateUtils";

const statusMap = {
  [Variant_upcoming_done_ongoing.upcoming]: {
    label: "Akan Datang",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  [Variant_upcoming_done_ongoing.ongoing]: {
    label: "Sedang Berlangsung",
    color: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  [Variant_upcoming_done_ongoing.done]: {
    label: "Selesai",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
};

const filterOptions = [
  { value: "Semua", label: "Semua" },
  { value: Variant_upcoming_done_ongoing.upcoming, label: "Akan Datang" },
  { value: Variant_upcoming_done_ongoing.ongoing, label: "Berlangsung" },
  { value: Variant_upcoming_done_ongoing.done, label: "Selesai" },
];

export default function KegiatanPage() {
  const { data: kegiatan = [], isLoading } = useAllKegiatan();
  const [filter, setFilter] = useState("Semua");

  const filtered =
    filter === "Semua" ? kegiatan : kegiatan.filter((k) => k.status === filter);

  // Sort: upcoming first, then ongoing, then done
  const sortOrder = {
    [Variant_upcoming_done_ongoing.upcoming]: 0,
    [Variant_upcoming_done_ongoing.ongoing]: 1,
    [Variant_upcoming_done_ongoing.done]: 2,
  };
  const sorted = [...filtered].sort(
    (a, b) => (sortOrder[a.status] ?? 3) - (sortOrder[b.status] ?? 3),
  );

  return (
    <div className="pt-16 min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-navy py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-brand-orange font-medium mb-2">
              Agenda & Program
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Kegiatan
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl">
              Program dan agenda kegiatan jurusan DKV SMKN 1 Dawuan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
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

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Skeleton className="h-52 rounded-t-lg" />
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-1/3 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {sorted.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {sorted.map((k, i) => {
                  const fotoUrl = k.fotoId
                    ? ExternalBlob.fromURL(k.fotoId).getDirectURL()
                    : null;
                  const status = statusMap[k.status] || {
                    label: k.status,
                    color: "bg-gray-100 text-gray-600",
                    dot: "bg-gray-400",
                  };

                  return (
                    <motion.div
                      key={k.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="card-hover overflow-hidden h-full">
                        {fotoUrl ? (
                          <div className="h-52 overflow-hidden">
                            <img
                              src={fotoUrl}
                              alt={k.judul}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="h-20 bg-gradient-to-br from-brand-navy/5 to-brand-navy/10 flex items-center justify-center">
                            <Calendar className="w-8 h-8 text-brand-navy/20" />
                          </div>
                        )}
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              className={`${status.color} text-xs flex items-center gap-1.5`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                              />
                              {status.label}
                            </Badge>
                          </div>
                          <h3 className="font-display font-bold text-brand-navy text-xl mb-2">
                            {k.judul}
                          </h3>
                          {k.deskripsi && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                              {k.deskripsi}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(k.tanggal)}
                            </span>
                            {k.lokasi && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {k.lokasi}
                              </span>
                            )}
                          </div>
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
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">
                  {filter === "Semua"
                    ? "Belum ada data kegiatan"
                    : "Tidak ada kegiatan dengan status ini"}
                </p>
                <p className="text-sm mt-1">
                  Data kegiatan akan segera ditambahkan.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
