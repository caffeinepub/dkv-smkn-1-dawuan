import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Image as ImageIcon, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ExternalBlob } from "../backend";
import { useAllGaleri } from "../hooks/useQueries";

function GaleriItem({
  item,
  onClick,
}: {
  item: {
    id: string;
    judul: string;
    deskripsi: string;
    kategori: string;
    fotoId: string;
  };
  onClick: () => void;
}) {
  const fotoUrl = item.fotoId
    ? ExternalBlob.fromURL(item.fotoId).getDirectURL()
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group cursor-pointer rounded-xl overflow-hidden shadow-card bg-secondary aspect-[4/3]"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {fotoUrl ? (
        <img
          src={fotoUrl}
          alt={item.judul}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
          <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-display font-bold text-white text-sm line-clamp-1">
            {item.judul}
          </p>
          {item.deskripsi && (
            <p className="text-white/70 text-xs mt-0.5 line-clamp-1">
              {item.deskripsi}
            </p>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ZoomIn className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GaleriPage() {
  const { data: galeri = [], isLoading } = useAllGaleri();
  const [activeKategori, setActiveKategori] = useState("Semua");
  const [lightboxItem, setLightboxItem] = useState<(typeof galeri)[0] | null>(
    null,
  );

  const categories = [
    "Semua",
    ...Array.from(new Set(galeri.map((g) => g.kategori))).filter(Boolean),
  ];

  const filtered =
    activeKategori === "Semua"
      ? galeri
      : galeri.filter((g) => g.kategori === activeKategori);

  return (
    <div className="pt-16 min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-navy py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-brand-orange font-medium mb-2">Karya Siswa</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Galeri Foto
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl">
              Kumpulan karya terbaik siswa DKV SMKN 1 Dawuan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Category Filters */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveKategori(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeKategori === cat
                    ? "bg-brand-navy text-white shadow-md"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <GaleriItem
                  key={item.id}
                  item={item}
                  onClick={() => setLightboxItem(item)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Belum ada foto di galeri</p>
            <p className="text-sm mt-1">
              Foto karya siswa akan segera ditambahkan.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-4xl max-h-[90vh] w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxItem.fotoId && (
                <img
                  src={ExternalBlob.fromURL(lightboxItem.fotoId).getDirectURL()}
                  alt={lightboxItem.judul}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                />
              )}
              <div className="mt-3 flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-white text-lg">
                    {lightboxItem.judul}
                  </h3>
                  {lightboxItem.deskripsi && (
                    <p className="text-white/70 text-sm mt-1">
                      {lightboxItem.deskripsi}
                    </p>
                  )}
                  {lightboxItem.kategori && (
                    <Badge className="bg-brand-orange/20 text-orange-300 mt-2 text-xs">
                      {lightboxItem.kategori}
                    </Badge>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxItem(null)}
                  className="ml-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
