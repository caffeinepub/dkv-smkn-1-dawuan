import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import { motion } from "motion/react";
import { ExternalBlob } from "../backend";
import { usePublishedInformasi } from "../hooks/useQueries";
import { formatDate } from "../utils/dateUtils";

export default function InformasiPage() {
  const { data: informasi = [], isLoading } = usePublishedInformasi();

  return (
    <div className="pt-16 min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-navy py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-brand-orange font-medium mb-2">Kabar Terbaru</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Informasi
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl">
              Berita, pengumuman, dan informasi terkini dari jurusan DKV SMKN 1
              Dawuan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 rounded-t-lg" />
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-1/3 mb-3" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : informasi.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {informasi.map((info, i) => {
              const coverUrl = info.coverFotoId
                ? ExternalBlob.fromURL(info.coverFotoId).getDirectURL()
                : null;
              return (
                <motion.div
                  key={info.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link to="/informasi/$id" params={{ id: info.id }}>
                    <Card className="card-hover h-full overflow-hidden cursor-pointer">
                      <div className="h-48 bg-gradient-to-br from-secondary to-muted overflow-hidden">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={info.judul}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Newspaper className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(info.tanggalPublish)}
                          </span>
                        </div>
                        <h2 className="font-display font-bold text-brand-navy text-lg mb-2 line-clamp-2">
                          {info.judul}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {info.ringkasan}
                        </p>
                        <span className="text-brand-orange text-sm font-medium flex items-center gap-1">
                          Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">
              Belum ada informasi yang dipublikasikan
            </p>
            <p className="text-sm mt-1">
              Informasi akan segera ditambahkan oleh admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
