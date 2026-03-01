import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useAdminAuth } from "./useAdminAuth";

const DEFAULT_LOGO = "/assets/generated/dkv-logo-transparent.dim_200x200.png";
const LOGO_GALERI_ID = "__site_logo_config__";
const LOGO_KATEGORI = "__system_logo__";

// ---------- Public read hook ----------
export function useSiteLogo() {
  const { actor, isFetching } = useActor();

  const query = useQuery<string>({
    queryKey: ["site-logo"],
    queryFn: async () => {
      if (!actor) return DEFAULT_LOGO;
      try {
        const allGaleri = await actor.getAllGaleri();
        const logoEntry = allGaleri.find((g) => g.kategori === LOGO_KATEGORI);
        if (!logoEntry || !logoEntry.deskripsi) return DEFAULT_LOGO;
        return logoEntry.deskripsi;
      } catch {
        return DEFAULT_LOGO;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const logoUrl = query.data ?? DEFAULT_LOGO;
  const isCustom = logoUrl !== DEFAULT_LOGO;

  return {
    logoUrl,
    isCustom,
    isLoading: query.isLoading,
  };
}

// ---------- Admin write hook ----------
export function useUpdateSiteLogo() {
  const { actor } = useActor();
  const { sessionToken } = useAdminAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (logoUrl: string) => {
      if (!actor) throw new Error("No actor");
      if (!sessionToken) throw new Error("Not authenticated");

      const allGaleri = await actor.getAllGaleri();
      const existing = allGaleri.find((g) => g.kategori === LOGO_KATEGORI);

      if (existing) {
        await actor.updateGaleri(sessionToken, existing.id, {
          ...existing,
          deskripsi: logoUrl,
        });
      } else {
        await actor.addGaleri(sessionToken, {
          id: LOGO_GALERI_ID,
          judul: "__system_logo__",
          deskripsi: logoUrl,
          kategori: LOGO_KATEGORI,
          fotoId: "",
          tanggalUpload: BigInt(Date.now()) * 1_000_000n,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-logo"] });
    },
  });
}

export function useResetSiteLogo() {
  const updateLogo = useUpdateSiteLogo();
  return {
    ...updateLogo,
    mutate: () => updateLogo.mutate(DEFAULT_LOGO),
    mutateAsync: () => updateLogo.mutateAsync(DEFAULT_LOGO),
  };
}
