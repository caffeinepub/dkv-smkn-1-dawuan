import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useParams,
  useRouterState,
} from "@tanstack/react-router";
import PublicLayout from "./components/layout/PublicLayout";
import GaleriPage from "./pages/GaleriPage";
import HomePage from "./pages/HomePage";
import InformasiDetailPage from "./pages/InformasiDetailPage";
import InformasiPage from "./pages/InformasiPage";
import KegiatanPage from "./pages/KegiatanPage";
import KontakPage from "./pages/KontakPage";
import PrestasiPage from "./pages/PrestasiPage";
import ProfilPage from "./pages/ProfilPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPage from "./pages/admin/AdminPage";

export { useNavigate, useParams, Link, useRouterState };

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Toaster richColors position="top-right" />
      <Outlet />
    </>
  ),
});

// Public layout route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayout,
});

// Public pages
const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: HomePage,
});

const profilRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/profil",
  component: ProfilPage,
});

const galeriRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/galeri",
  component: GaleriPage,
});

const informasiRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/informasi",
  component: InformasiPage,
});

const informasiDetailRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/informasi/$id",
  component: InformasiDetailPage,
});

const prestasiRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/prestasi",
  component: PrestasiPage,
});

const kegiatanRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/kegiatan",
  component: KegiatanPage,
});

const kontakRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/kontak",
  component: KontakPage,
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: AdminDashboard,
});

const adminDashboardSectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard/$section",
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    profilRoute,
    galeriRoute,
    informasiRoute,
    informasiDetailRoute,
    prestasiRoute,
    kegiatanRoute,
    kontakRoute,
  ]),
  adminRoute,
  adminDashboardRoute,
  adminDashboardSectionRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
