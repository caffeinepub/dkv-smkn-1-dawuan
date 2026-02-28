import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  Calendar,
  ChevronRight,
  Image,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Newspaper,
  Phone,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsAdmin } from "../../hooks/useQueries";
import AdminGaleriSection from "./sections/AdminGaleriSection";
import AdminInformasiSection from "./sections/AdminInformasiSection";
import AdminKegiatanSection from "./sections/AdminKegiatanSection";
import AdminKontakSection from "./sections/AdminKontakSection";
import AdminPengajarSection from "./sections/AdminPengajarSection";
import AdminPesanSection from "./sections/AdminPesanSection";
import AdminPrestasiSection from "./sections/AdminPrestasiSection";
import AdminProfilSection from "./sections/AdminProfilSection";

type Section =
  | "profil"
  | "pengajar"
  | "galeri"
  | "informasi"
  | "prestasi"
  | "kegiatan"
  | "kontak"
  | "pesan";

const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "profil", label: "Profil Jurusan", icon: LayoutDashboard },
  { id: "pengajar", label: "Pengajar", icon: Users },
  { id: "galeri", label: "Galeri", icon: Image },
  { id: "informasi", label: "Informasi", icon: Newspaper },
  { id: "prestasi", label: "Prestasi", icon: Trophy },
  { id: "kegiatan", label: "Kegiatan", icon: Calendar },
  { id: "kontak", label: "Kontak", icon: Phone },
  { id: "pesan", label: "Pesan Masuk", icon: MessageSquare },
];

const sectionComponents: Record<Section, React.ComponentType> = {
  profil: AdminProfilSection,
  pengajar: AdminPengajarSection,
  galeri: AdminGaleriSection,
  informasi: AdminInformasiSection,
  prestasi: AdminPrestasiSection,
  kegiatan: AdminKegiatanSection,
  kontak: AdminKontakSection,
  pesan: AdminPesanSection,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const activeSection: Section = (params.section as Section) || "profil";

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { clear, identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;

  // Auth guard
  useEffect(() => {
    if (!isInitializing && !checkingAdmin) {
      if (!isAuthenticated || isAdmin === false) {
        navigate({ to: "/admin" });
      }
    }
  }, [isInitializing, checkingAdmin, isAuthenticated, isAdmin, navigate]);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/admin" });
  };

  const setSection = (s: Section) => {
    navigate({ to: "/admin/dashboard/$section", params: { section: s } });
    setMobileSidebarOpen(false);
  };

  if (isInitializing || checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-navy animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const ActiveComponent =
    sectionComponents[activeSection] || AdminProfilSection;
  const activeNavItem = navItems.find((n) => n.id === activeSection);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/dkv-logo-transparent.dim_200x200.png"
              alt="Logo"
              className="w-9 h-9 object-contain"
            />
            <div className="leading-tight">
              <p className="font-display font-bold text-sm">DKV Admin</p>
              <p className="text-xs text-sidebar-foreground/60">
                SMKN 1 Dawuan
              </p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p className="text-xs text-sidebar-foreground/40 uppercase tracking-wider px-3 mb-2 mt-1">
            Menu
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = item.id === activeSection;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {active && <ChevronRight className="w-3 h-3" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-sidebar-foreground/50">Masuk sebagai</p>
            <p className="text-xs text-sidebar-foreground/80 font-mono truncate">
              {identity?.getPrincipal().toString().slice(0, 20)}...
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/60 hover:text-red-400 hover:bg-red-400/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          onKeyDown={() => setMobileSidebarOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-border h-14 flex items-center px-4 gap-4">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-secondary"
          >
            {mobileSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">
              {activeNavItem?.label || "Dashboard"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="text-xs">
                Lihat Website
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
