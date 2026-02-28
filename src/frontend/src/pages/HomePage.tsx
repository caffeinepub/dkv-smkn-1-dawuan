import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Image,
  Monitor,
  Newspaper,
  Palette,
  Pen,
  Phone,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import {
  useAllKegiatan,
  useAllPengajar,
  useAllPrestasi,
  usePublishedInformasi,
} from "../hooks/useQueries";
import { Variant_upcoming_done_ongoing } from "../hooks/useQueries";
import { formatDateShort } from "../utils/dateUtils";

const quickLinks = [
  {
    icon: Users,
    label: "Profil",
    desc: "Visi, misi & pengajar",
    href: "/profil" as const,
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Image,
    label: "Galeri",
    desc: "Karya siswa terbaik",
    href: "/galeri" as const,
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Newspaper,
    label: "Informasi",
    desc: "Berita & pengumuman",
    href: "/informasi" as const,
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Trophy,
    label: "Prestasi",
    desc: "Pencapaian siswa",
    href: "/prestasi" as const,
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: Calendar,
    label: "Kegiatan",
    desc: "Agenda & program",
    href: "/kegiatan" as const,
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Phone,
    label: "Kontak",
    desc: "Hubungi kami",
    href: "/kontak" as const,
    color: "bg-red-50 text-red-600",
  },
];

const skills = [
  {
    icon: Palette,
    label: "Desain Grafis",
    desc: "Logo, poster, identitas visual",
  },
  { icon: Monitor, label: "Desain Digital", desc: "UI/UX, media sosial, web" },
  { icon: Pen, label: "Ilustrasi", desc: "Manual & digital drawing" },
  { icon: Image, label: "Fotografi", desc: "Komersial & editorial" },
];

export default function HomePage() {
  const { data: pengajar = [] } = useAllPengajar();
  const { data: prestasi = [] } = useAllPrestasi();
  const { data: informasi = [] } = usePublishedInformasi();
  const { data: kegiatan = [] } = useAllKegiatan();

  const upcomingKegiatan = kegiatan
    .filter((k) => k.status === Variant_upcoming_done_ongoing.upcoming)
    .slice(0, 3);

  const latestInfo = informasi.slice(0, 3);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden min-h-[520px] flex items-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/assets/generated/hero-banner.dim_1200x500.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 hero-gradient opacity-80" />
        <div className="relative container mx-auto px-4 py-16 z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-brand-orange/20 text-orange-200 border-orange-400/30 mb-4">
                SMKN 1 Dawuan
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Jurusan{" "}
                <span className="text-brand-orange">Desain Komunikasi</span>
                <br />
                Visual
              </h1>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Membentuk generasi kreatif yang kompeten di bidang desain
                grafis, ilustrasi, fotografi, dan komunikasi visual untuk siap
                bersaing di dunia industri.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/profil">
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-medium px-6 shadow-orange">
                    Pelajari Lebih Lanjut
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/galeri">
                  <Button
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10 bg-transparent"
                  >
                    Lihat Galeri Karya
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
              {[
                {
                  value: pengajar.length || "6+",
                  label: "Pengajar Profesional",
                },
                { value: prestasi.length || "50+", label: "Prestasi Diraih" },
                { value: "3", label: "Kompetensi Keahlian" },
                { value: "2010", label: "Tahun Berdiri" },
              ].map((stat, i) => (
                <motion.div
                  key={`stat-${stat.label}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="py-4 px-4 text-center"
                >
                  <p className="font-display text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/70 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-3">
              Eksplorasi Jurusan DKV
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Temukan informasi lengkap tentang program dan kegiatan kami
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={link.href}>
                  <Card className="card-hover cursor-pointer h-full">
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center mx-auto mb-3`}
                      >
                        <link.icon className="w-6 h-6" />
                      </div>
                      <p className="font-display font-semibold text-sm text-brand-navy">
                        {link.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {link.desc}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 section-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-3 section-title-accent">
              Kompetensi Keahlian
            </h2>
            <p className="text-muted-foreground mt-6 max-w-xl">
              Program pembelajaran komprehensif untuk menyiapkan siswa menjadi
              profesional kreatif
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="card-hover border-border/60 h-full">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-navy flex items-center justify-center mb-4">
                      <skill.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-brand-navy mb-2">
                      {skill.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {skill.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      {latestInfo.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl font-bold text-brand-navy section-title-accent">
                  Berita Terkini
                </h2>
              </motion.div>
              <Link
                to="/informasi"
                className="text-brand-orange hover:underline text-sm font-medium flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestInfo.map((info, i) => (
                <motion.div
                  key={info.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to="/informasi/$id" params={{ id: info.id }}>
                    <Card className="card-hover h-full cursor-pointer">
                      <CardContent className="p-5">
                        <Badge className="bg-secondary text-muted-foreground mb-3 text-xs">
                          {formatDateShort(info.tanggalPublish)}
                        </Badge>
                        <h3 className="font-display font-bold text-brand-navy mb-2 line-clamp-2">
                          {info.judul}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {info.ringkasan}
                        </p>
                        <p className="text-brand-orange text-sm font-medium mt-3 flex items-center gap-1">
                          Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingKegiatan.length > 0 && (
        <section className="py-16 bg-brand-navy">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl font-bold text-white section-title-accent">
                  Kegiatan Mendatang
                </h2>
              </motion.div>
              <Link
                to="/kegiatan"
                className="text-brand-orange hover:underline text-sm font-medium flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingKegiatan.map((k, i) => (
                <motion.div
                  key={k.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-white/10 border-white/20 text-white h-full card-hover">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-brand-orange/20 text-orange-300 border-orange-400/30">
                          Segera
                        </Badge>
                        <span className="text-white/60 text-xs">
                          {formatDateShort(k.tanggal)}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg mb-2 line-clamp-2">
                        {k.judul}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-2">
                        {k.deskripsi}
                      </p>
                      {k.lokasi && (
                        <p className="text-white/50 text-xs mt-2">
                          📍 {k.lokasi}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-brand-orange">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Star className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Bergabunglah dengan DKV SMKN 1 Dawuan
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Jadilah bagian dari komunitas kreatif kami dan wujudkan potensi
              desainmu bersama instruktur berpengalaman.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/profil">
                <Button className="bg-white text-brand-orange hover:bg-white/90 font-medium px-8">
                  Pelajari Program
                </Button>
              </Link>
              <Link to="/kontak">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
