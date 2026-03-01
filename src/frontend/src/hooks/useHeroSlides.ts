import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { useAdminAuth } from "./useAdminAuth";

// We store hero slides as a special unpublished Informasi entry with this reserved ID
const SLIDES_INFORMASI_ID = "__hero_slides_config__";

export interface HeroSlide {
  id: string;
  judul: string;
  deskripsi: string;
  fotoUrl: string;
  urutan: number;
}

// ---------- Public read hook (no auth needed) ----------
export function useHeroSlides() {
  const { actor, isFetching } = useActor();

  return useQuery<HeroSlide[]>({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        // We use getAllGaleri approach — read all galeri and look for
        // our special entry stored as a galeri item with reserved id.
        // But since galeri has judul/deskripsi/fotoId, we use informasi instead.
        // We read via getPublishedInformasi won't include unpublished entries,
        // so we look for the special entry another way.
        //
        // Alternative: store slides JSON in the 'isi' field of a galeri entry
        // identified by a known kategori "__system_slides__"
        const allGaleri = await actor.getAllGaleri();
        const systemEntry = allGaleri.find(
          (g) => g.kategori === "__system_slides__",
        );
        if (!systemEntry || !systemEntry.deskripsi) return [];
        const parsed = JSON.parse(systemEntry.deskripsi) as HeroSlide[];
        return [...parsed].sort((a, b) => a.urutan - b.urutan);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

// ---------- Admin write hook ----------
export function useSaveHeroSlides() {
  const { actor } = useActor();
  const { sessionToken } = useAdminAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (slides: HeroSlide[]) => {
      if (!actor) throw new Error("No actor");
      if (!sessionToken) throw new Error("Not authenticated");

      const sortedSlides = [...slides].sort((a, b) => a.urutan - b.urutan);
      const slidesJson = JSON.stringify(sortedSlides);

      // Check if our system galeri entry already exists
      const allGaleri = await actor.getAllGaleri();
      const existing = allGaleri.find(
        (g) => g.kategori === "__system_slides__",
      );

      const entryId = existing?.id ?? SLIDES_INFORMASI_ID;

      if (existing) {
        await actor.updateGaleri(sessionToken, entryId, {
          ...existing,
          deskripsi: slidesJson,
        });
      } else {
        await actor.addGaleri(sessionToken, {
          id: entryId,
          judul: "__system_slides__",
          deskripsi: slidesJson,
          kategori: "__system_slides__",
          fotoId: "",
          tanggalUpload: BigInt(Date.now()) * 1_000_000n,
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hero-slides"] });
    },
  });
}
