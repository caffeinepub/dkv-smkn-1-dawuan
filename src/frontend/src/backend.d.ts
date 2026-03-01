import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface T__7 {
    jamOperasional: string;
    alamat: string;
    koordinat: string;
    email: string;
    telepon: string;
}
export interface T__8 {
    id: string;
    isi: string;
    nama: string;
    email: string;
    subjek: string;
    timestamp: Time;
}
export interface T__1 {
    id: string;
    tahun: bigint;
    judul: string;
    deskripsi: string;
    tingkat: Variant_nasional_internasional_provinsi_kabupaten_sekolah;
    siswa: string;
    fotoId: string;
}
export interface T__4 {
    id: string;
    isi: string;
    published: boolean;
    ringkasan: string;
    judul: string;
    tanggalPublish: Time;
    coverFotoId: string;
}
export interface T__3 {
    id: string;
    status: Variant_upcoming_done_ongoing;
    tanggal: Time;
    judul: string;
    deskripsi: string;
    lokasi: string;
    fotoId: string;
}
export interface T__2 {
    id: string;
    bio: string;
    nama: string;
    jabatan: string;
    urutan: bigint;
    mataPelajaran: string;
    fotoId: string;
}
export interface T {
    id: string;
    status: Status;
    alamat: string;
    nama: string;
    nisn: string;
    angkatan: bigint;
    kelas: string;
    jurusan: string;
    fotoId: string;
}
export interface T__5 {
    id: string;
    tanggalUpload: Time;
    judul: string;
    deskripsi: string;
    kategori: string;
    fotoId: string;
}
export interface T__6 {
    tujuan: string;
    misi: string;
    visi: string;
}
export interface UserProfile {
    name: string;
}
export enum Status {
    aktif = "aktif",
    alumni = "alumni"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_nasional_internasional_provinsi_kabupaten_sekolah {
    nasional = "nasional",
    internasional = "internasional",
    provinsi = "provinsi",
    kabupaten = "kabupaten",
    sekolah = "sekolah"
}
export enum Variant_upcoming_done_ongoing {
    upcoming = "upcoming",
    done = "done",
    ongoing = "ongoing"
}
export interface backendInterface {
    addGaleri(sessionToken: string, galeri: T__5): Promise<void>;
    addInformasi(sessionToken: string, informasi: T__4): Promise<void>;
    addKegiatan(sessionToken: string, kegiatan: T__3): Promise<void>;
    addPengajar(sessionToken: string, pengajar: T__2): Promise<void>;
    addPrestasi(sessionToken: string, prestasi: T__1): Promise<void>;
    addSiswa(sessionToken: string, siswa: T): Promise<void>;
    adminLogin(username: string, password: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminLogout(sessionToken: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGaleri(sessionToken: string, id: string): Promise<void>;
    deleteInformasi(sessionToken: string, id: string): Promise<void>;
    deleteKegiatan(sessionToken: string, id: string): Promise<void>;
    deletePengajar(sessionToken: string, id: string): Promise<void>;
    deletePrestasi(sessionToken: string, id: string): Promise<void>;
    deleteSiswa(sessionToken: string, id: string): Promise<void>;
    getAllGaleri(): Promise<Array<T__5>>;
    getAllInformasi(sessionToken: string): Promise<Array<T__4>>;
    getAllKegiatan(): Promise<Array<T__3>>;
    getAllPengajar(): Promise<Array<T__2>>;
    getAllPesan(sessionToken: string): Promise<Array<T__8>>;
    getAllPrestasi(): Promise<Array<T__1>>;
    getAllSiswa(sessionToken: string): Promise<Array<T>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGaleriByKategori(kategori: string): Promise<Array<T__5>>;
    getKegiatanByStatus(status: Variant_upcoming_done_ongoing): Promise<Array<T__3>>;
    getKontak(): Promise<T__7 | null>;
    getPrestasiByTingkat(tingkat: Variant_nasional_internasional_provinsi_kabupaten_sekolah): Promise<Array<T__1>>;
    getProfil(): Promise<T__6 | null>;
    getPublishedInformasi(): Promise<Array<T__4>>;
    getSiswaByKelas(sessionToken: string, kelas: string): Promise<Array<T>>;
    getSiswaByStatus(sessionToken: string, status: Status): Promise<Array<T>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isSessionValid(sessionToken: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendPesan(nama: string, email: string, subjek: string, isi: string, timestamp: Time): Promise<void>;
    setAdminCredentials(username: string, password: string, caffeineAdminToken: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    updateGaleri(sessionToken: string, id: string, updated: T__5): Promise<void>;
    updateInformasi(sessionToken: string, id: string, updated: T__4): Promise<void>;
    updateKegiatan(sessionToken: string, id: string, updated: T__3): Promise<void>;
    updateKontak(sessionToken: string, alamat: string, telepon: string, email: string, jamOperasional: string, koordinat: string): Promise<void>;
    updatePengajar(sessionToken: string, id: string, updated: T__2): Promise<void>;
    updatePrestasi(sessionToken: string, id: string, updated: T__1): Promise<void>;
    updateProfil(sessionToken: string, visi: string, misi: string, tujuan: string): Promise<void>;
    updateSiswa(sessionToken: string, id: string, updated: T): Promise<void>;
}
