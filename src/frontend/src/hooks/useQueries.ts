import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  T__4 as Galeri,
  T__3 as Informasi,
  T__2 as Kegiatan,
  T__6 as Kontak,
  T__1 as Pengajar,
  T__7 as Pesan,
  T as Prestasi,
  T__5 as Profil,
  UserRole,
} from "../backend.d";
import {
  Variant_nasional_internasional_provinsi_kabupaten_sekolah,
  Variant_upcoming_done_ongoing,
} from "../backend.d";
import { useActor } from "./useActor";

export type {
  Pengajar,
  Kegiatan,
  Informasi,
  Galeri,
  Prestasi,
  Profil,
  Kontak,
  Pesan,
};
export {
  Variant_nasional_internasional_provinsi_kabupaten_sekolah,
  Variant_upcoming_done_ongoing,
};

// ---------- AUTH ----------
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return "guest" as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

// ---------- PROFIL ----------
export function useProfil() {
  const { actor, isFetching } = useActor();
  return useQuery<Profil | null>({
    queryKey: ["profil"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProfil();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateProfil() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Profil) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProfil(data.visi, data.misi, data.tujuan);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profil"] }),
  });
}

// ---------- PENGAJAR ----------
export function useAllPengajar() {
  const { actor, isFetching } = useActor();
  return useQuery<Pengajar[]>({
    queryKey: ["pengajar"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPengajar();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPengajar() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Pengajar) => {
      if (!actor) throw new Error("No actor");
      return actor.addPengajar(p);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pengajar"] }),
  });
}

export function useUpdatePengajar() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Pengajar }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePengajar(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pengajar"] }),
  });
}

export function useDeletePengajar() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deletePengajar(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pengajar"] }),
  });
}

// ---------- GALERI ----------
export function useAllGaleri() {
  const { actor, isFetching } = useActor();
  return useQuery<Galeri[]>({
    queryKey: ["galeri"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGaleri();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGaleri() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (g: Galeri) => {
      if (!actor) throw new Error("No actor");
      return actor.addGaleri(g);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["galeri"] }),
  });
}

export function useUpdateGaleri() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Galeri }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateGaleri(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["galeri"] }),
  });
}

export function useDeleteGaleri() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteGaleri(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["galeri"] }),
  });
}

// ---------- INFORMASI ----------
export function usePublishedInformasi() {
  const { actor, isFetching } = useActor();
  return useQuery<Informasi[]>({
    queryKey: ["informasi-published"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedInformasi();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllInformasi() {
  const { actor, isFetching } = useActor();
  return useQuery<Informasi[]>({
    queryKey: ["informasi-all"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInformasi();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddInformasi() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (info: Informasi) => {
      if (!actor) throw new Error("No actor");
      return actor.addInformasi(info);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["informasi-all"] });
      qc.invalidateQueries({ queryKey: ["informasi-published"] });
    },
  });
}

export function useUpdateInformasi() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Informasi }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateInformasi(id, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["informasi-all"] });
      qc.invalidateQueries({ queryKey: ["informasi-published"] });
    },
  });
}

export function useDeleteInformasi() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteInformasi(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["informasi-all"] });
      qc.invalidateQueries({ queryKey: ["informasi-published"] });
    },
  });
}

// ---------- PRESTASI ----------
export function useAllPrestasi() {
  const { actor, isFetching } = useActor();
  return useQuery<Prestasi[]>({
    queryKey: ["prestasi"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPrestasi();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddPrestasi() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Prestasi) => {
      if (!actor) throw new Error("No actor");
      return actor.addPrestasi(p);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prestasi"] }),
  });
}

export function useUpdatePrestasi() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Prestasi }) => {
      if (!actor) throw new Error("No actor");
      return actor.updatePrestasi(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prestasi"] }),
  });
}

export function useDeletePrestasi() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deletePrestasi(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prestasi"] }),
  });
}

// ---------- KEGIATAN ----------
export function useAllKegiatan() {
  const { actor, isFetching } = useActor();
  return useQuery<Kegiatan[]>({
    queryKey: ["kegiatan"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllKegiatan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddKegiatan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (k: Kegiatan) => {
      if (!actor) throw new Error("No actor");
      return actor.addKegiatan(k);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kegiatan"] }),
  });
}

export function useUpdateKegiatan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Kegiatan }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateKegiatan(id, data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kegiatan"] }),
  });
}

export function useDeleteKegiatan() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteKegiatan(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kegiatan"] }),
  });
}

// ---------- KONTAK ----------
export function useKontak() {
  const { actor, isFetching } = useActor();
  return useQuery<Kontak | null>({
    queryKey: ["kontak"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getKontak();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateKontak() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (k: Kontak) => {
      if (!actor) throw new Error("No actor");
      return actor.updateKontak(
        k.alamat,
        k.telepon,
        k.email,
        k.jamOperasional,
        k.koordinat,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kontak"] }),
  });
}

// ---------- PESAN ----------
export function useAllPesan() {
  const { actor, isFetching } = useActor();
  return useQuery<Pesan[]>({
    queryKey: ["pesan"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPesan();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendPesan() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      nama: string;
      email: string;
      subjek: string;
      isi: string;
    }) => {
      if (!actor) throw new Error("No actor");
      const timestamp = BigInt(Date.now()) * 1_000_000n;
      return actor.sendPesan(
        data.nama,
        data.email,
        data.subjek,
        data.isi,
        timestamp,
      );
    },
  });
}
