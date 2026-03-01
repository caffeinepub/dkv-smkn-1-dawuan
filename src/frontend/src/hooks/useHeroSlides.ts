import { useCallback, useEffect, useState } from "react";

const SLIDES_KEY = "dkv_hero_slides";

export interface HeroSlide {
  id: string;
  judul: string;
  deskripsi: string;
  fotoUrl: string;
  urutan: number;
}

function loadSlides(): HeroSlide[] {
  try {
    const raw = localStorage.getItem(SLIDES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HeroSlide[];
    return [...parsed].sort((a, b) => a.urutan - b.urutan);
  } catch {
    return [];
  }
}

function saveSlides(slides: HeroSlide[]) {
  localStorage.setItem(SLIDES_KEY, JSON.stringify(slides));
}

function broadcastUpdate(updated: HeroSlide[]) {
  window.dispatchEvent(
    new StorageEvent("storage", {
      key: SLIDES_KEY,
      newValue: JSON.stringify(updated),
    }),
  );
}

export function useHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>(loadSlides);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === SLIDES_KEY) {
        setSlides(loadSlides());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addSlide = useCallback((slide: HeroSlide) => {
    setSlides((prev) => {
      const updated = [...prev, slide].sort((a, b) => a.urutan - b.urutan);
      saveSlides(updated);
      broadcastUpdate(updated);
      return updated;
    });
  }, []);

  const updateSlide = useCallback((id: string, data: Partial<HeroSlide>) => {
    setSlides((prev) => {
      const updated = prev
        .map((s) => (s.id === id ? { ...s, ...data } : s))
        .sort((a, b) => a.urutan - b.urutan);
      saveSlides(updated);
      broadcastUpdate(updated);
      return updated;
    });
  }, []);

  const deleteSlide = useCallback((id: string) => {
    setSlides((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveSlides(updated);
      broadcastUpdate(updated);
      return updated;
    });
  }, []);

  const moveSlide = useCallback((id: string, direction: "up" | "down") => {
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const updated = [...prev];
      const tempUrutan = updated[idx].urutan;
      updated[idx] = { ...updated[idx], urutan: updated[newIdx].urutan };
      updated[newIdx] = { ...updated[newIdx], urutan: tempUrutan };
      updated.sort((a, b) => a.urutan - b.urutan);
      saveSlides(updated);
      broadcastUpdate(updated);
      return updated;
    });
  }, []);

  return { slides, addSlide, updateSlide, deleteSlide, moveSlide };
}
