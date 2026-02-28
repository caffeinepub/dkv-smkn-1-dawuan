import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Newspaper } from "lucide-react";
import { motion } from "motion/react";
import { ExternalBlob } from "../backend";
import { usePublishedInformasi } from "../hooks/useQueries";
import { formatDate } from "../utils/dateUtils";

export default function InformasiDetailPage() {
  const { id } = useParams({ from: "/public/informasi/$id" });
  const { data: informasi = [], isLoading } = usePublishedInformasi();

  const artikel = informasi.find((i) => i.id === id);

  const coverUrl = artikel?.coverFotoId
    ? ExternalBlob.fromURL(artikel.coverFotoId).getDirectURL()
    : null;

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 rounded-xl mb-6" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-full mb-3" />
          ))}
        </div>
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="font-display text-2xl font-bold text-brand-navy mb-2">
            Artikel Tidak Ditemukan
          </h2>
          <p className="text-muted-foreground mb-6">
            Artikel yang Anda cari tidak tersedia.
          </p>
          <Link to="/informasi">
            <Button className="bg-brand-navy text-white hover:bg-brand-navy/90">
              Kembali ke Informasi
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back button */}
          <Link to="/informasi" className="inline-block mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-brand-navy"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Informasi
            </Button>
          </Link>

          {/* Cover Image */}
          {coverUrl && (
            <div className="rounded-xl overflow-hidden mb-8 aspect-video">
              <img
                src={coverUrl}
                alt={artikel.judul}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20">
              Informasi
            </Badge>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(artikel.tanggalPublish)}
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl font-bold text-brand-navy mb-4 leading-tight">
            {artikel.judul}
          </h1>

          {/* Summary */}
          {artikel.ringkasan && (
            <p className="text-lg text-muted-foreground border-l-4 border-brand-orange pl-4 mb-8 italic">
              {artikel.ringkasan}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            {artikel.isi.split("\n").map((paragraph, i) => {
              const stableKey = `line-${i}-${paragraph.slice(0, 8)}`;
              if (paragraph.trim()) {
                return (
                  <p
                    key={stableKey}
                    className="text-foreground leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                );
              }
              return <br key={stableKey} />;
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
