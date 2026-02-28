import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/galeri", label: "Galeri" },
  { href: "/informasi", label: "Informasi" },
  { href: "/prestasi", label: "Prestasi" },
  { href: "/kegiatan", label: "Kegiatan" },
  { href: "/kontak", label: "Kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is used as trigger to close menu on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/generated/dkv-logo-transparent.dim_200x200.png"
              alt="DKV Logo"
              className="w-10 h-10 object-contain"
            />
            <div className="leading-tight">
              <p className="font-display font-bold text-base text-brand-navy">
                DKV SMKN 1 Dawuan
              </p>
              <p className="text-xs text-muted-foreground">
                Desain Komunikasi Visual
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-navy text-white"
                      : "text-foreground/70 hover:text-brand-navy hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Admin Link + Hamburger */}
          <div className="flex items-center gap-2">
            <Link to="/admin" className="hidden md:block">
              <Button
                size="sm"
                className="bg-brand-orange text-white hover:bg-brand-orange/90 font-medium"
              >
                Admin
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-md hover:bg-secondary"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-navy text-white"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link to="/admin" className="mt-1">
                <Button className="w-full bg-brand-orange text-white hover:bg-brand-orange/90">
                  Admin Panel
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
