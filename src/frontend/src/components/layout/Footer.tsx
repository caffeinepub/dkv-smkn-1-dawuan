import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-brand-navy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/dkv-logo-transparent.dim_200x200.png"
                alt="DKV Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <p className="font-display font-bold text-lg">
                  DKV SMKN 1 Dawuan
                </p>
                <p className="text-xs text-white/60">
                  Desain Komunikasi Visual
                </p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Jurusan Desain Komunikasi Visual SMKN 1 Dawuan mencetak generasi
              kreatif yang siap bersaing di dunia industri desain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-brand-orange">
              Navigasi
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/profil" as const, label: "Profil Jurusan" },
                { to: "/galeri" as const, label: "Galeri Karya" },
                { to: "/informasi" as const, label: "Informasi" },
                { to: "/prestasi" as const, label: "Prestasi" },
                { to: "/kegiatan" as const, label: "Kegiatan" },
                { to: "/kontak" as const, label: "Kontak" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 hover:text-brand-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-brand-orange">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-orange shrink-0" />
                <span>Jl. Raya Dawuan, Kec. Dawuan, Karawang, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <span>(0267) 123456</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <span>dkv@smkn1dawuan.sch.id</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Clock className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Senin–Sabtu: 07.00–15.00 WIB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © {year} DKV SMKN 1 Dawuan. Hak cipta dilindungi.
          </p>
          <p className="text-sm text-white/50">
            Dibuat dengan ❤️ menggunakan{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
