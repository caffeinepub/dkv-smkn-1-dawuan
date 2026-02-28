import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, GraduationCap, Lightbulb, Target } from "lucide-react";
import { motion } from "motion/react";
import { ExternalBlob } from "../backend";
import { useAllPengajar, useProfil } from "../hooks/useQueries";

function TeacherCard({
  pengajar,
}: {
  pengajar: {
    id: string;
    nama: string;
    jabatan: string;
    mataPelajaran: string;
    bio: string;
    fotoId: string;
    urutan: bigint;
  };
}) {
  const fotoUrl = pengajar.fotoId
    ? ExternalBlob.fromURL(pengajar.fotoId).getDirectURL()
    : null;

  return (
    <Card className="card-hover overflow-hidden">
      <div className="relative h-52 bg-gradient-to-br from-brand-navy to-brand-navy/80">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt={pengajar.nama}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white/60" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-display font-bold text-white text-lg line-clamp-1">
            {pengajar.nama}
          </h3>
          <p className="text-white/80 text-sm">{pengajar.jabatan}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <Badge className="bg-brand-orange/10 text-brand-orange border-brand-orange/20 mb-3 text-xs">
          {pengajar.mataPelajaran}
        </Badge>
        {pengajar.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {pengajar.bio}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProfilPage() {
  const { data: profil, isLoading: profilLoading } = useProfil();
  const { data: pengajar = [], isLoading: pengajarLoading } = useAllPengajar();

  const sortedPengajar = [...pengajar].sort(
    (a, b) => Number(a.urutan) - Number(b.urutan),
  );

  return (
    <div className="pt-16 min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-navy py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-brand-orange font-medium mb-2">Jurusan DKV</p>
            <h1 className="font-display text-4xl font-bold text-white mb-3">
              Profil Jurusan
            </h1>
            <p className="text-white/70 max-w-2xl">
              Mengenal lebih dalam jurusan Desain Komunikasi Visual SMKN 1
              Dawuan
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="visi" className="w-full">
          <TabsList className="flex flex-wrap gap-1 h-auto p-1 mb-8 bg-secondary rounded-xl">
            <TabsTrigger
              value="visi"
              className="rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visi
            </TabsTrigger>
            <TabsTrigger
              value="misi"
              className="rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Misi
            </TabsTrigger>
            <TabsTrigger
              value="tujuan"
              className="rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Tujuan
            </TabsTrigger>
            <TabsTrigger
              value="pengajar"
              className="rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Pengajar
            </TabsTrigger>
          </TabsList>

          {/* Visi */}
          <TabsContent value="visi">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-card">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-navy flex items-center justify-center">
                      <Eye className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-brand-navy">
                        Visi
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Pandangan jauh ke depan jurusan DKV
                      </p>
                    </div>
                  </div>
                  {profilLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : profil?.visi ? (
                    <div className="prose prose-lg max-w-none">
                      <p className="text-foreground leading-relaxed text-lg border-l-4 border-brand-orange pl-6 italic">
                        {profil.visi}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <Eye className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Visi belum tersedia. Silakan hubungi admin.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Misi */}
          <TabsContent value="misi">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-card">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-orange flex items-center justify-center">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-brand-navy">
                        Misi
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Langkah nyata menuju visi jurusan DKV
                      </p>
                    </div>
                  </div>
                  {profilLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  ) : profil?.misi ? (
                    <div className="space-y-4">
                      {profil.misi
                        .split("\n")
                        .filter(Boolean)
                        .map((line, i) => (
                          <div
                            key={`misi-${line.slice(0, 10)}-${i}`}
                            className="flex gap-3"
                          >
                            <span className="w-6 h-6 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-foreground leading-relaxed">
                              {line}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Misi belum tersedia. Silakan hubungi admin.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Tujuan */}
          <TabsContent value="tujuan">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-card">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center">
                      <Lightbulb className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-brand-navy">
                        Tujuan
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Sasaran yang ingin dicapai jurusan DKV
                      </p>
                    </div>
                  </div>
                  {profilLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  ) : profil?.tujuan ? (
                    <div className="space-y-4">
                      {profil.tujuan
                        .split("\n")
                        .filter(Boolean)
                        .map((line, i) => (
                          <div
                            key={`tujuan-${line.slice(0, 10)}-${i}`}
                            className="flex gap-3 items-start"
                          >
                            <span className="text-green-600 mt-0.5">✓</span>
                            <p className="text-foreground leading-relaxed">
                              {line}
                            </p>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Tujuan belum tersedia. Silakan hubungi admin.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Pengajar */}
          <TabsContent value="pengajar">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-brand-navy mb-2">
                  Tim Pengajar
                </h2>
                <p className="text-muted-foreground">
                  Instruktur berpengalaman dan berkompeten di bidang desain
                  komunikasi visual
                </p>
              </div>

              {pengajarLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <Skeleton className="h-52 rounded-t-lg" />
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : sortedPengajar.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedPengajar.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <TeacherCard pengajar={p} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Belum ada data pengajar</p>
                  <p className="text-sm mt-1">
                    Data pengajar akan segera ditambahkan.
                  </p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
