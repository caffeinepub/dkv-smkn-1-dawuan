# DKV SMKN 1 Dawuan Website

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Public website for Jurusan DKV (Desain Komunikasi Visual) SMKN 1 Dawuan
- Admin login system with role-based access control
- Menu navigasi: Profil, Galeri, Informasi, Prestasi, Kegiatan, Kontak
- Profil page: Visi, Misi, Tujuan, dan daftar Pengajar dengan foto
- Galeri page: grid foto kegiatan/karya siswa, admin dapat upload/hapus foto
- Informasi page: daftar berita/info, admin dapat tambah/edit/hapus
- Prestasi page: daftar prestasi siswa/jurusan, admin dapat tambah/edit/hapus
- Kegiatan page: daftar kegiatan, admin dapat tambah/edit/hapus
- Kontak page: informasi kontak jurusan dan form pesan
- Admin dashboard: kelola semua konten (pengajar, galeri, informasi, prestasi, kegiatan, profil)

### Modify
- (none, new project)

### Remove
- (none, new project)

## Implementation Plan

### Backend (Motoko)
- Auth: admin login (username/password), session management
- Profil: store/update visi, misi, tujuan
- Pengajar: CRUD pengajar (nama, jabatan, mata pelajaran, foto URL)
- Galeri: CRUD foto galeri (judul, deskripsi, foto URL, kategori)
- Informasi: CRUD artikel informasi (judul, isi, tanggal, foto)
- Prestasi: CRUD prestasi (judul, deskripsi, tahun, foto, tingkat)
- Kegiatan: CRUD kegiatan (judul, deskripsi, tanggal, foto, lokasi)
- Kontak: store informasi kontak, terima & simpan pesan masuk

### Frontend (React + TypeScript)
- Landing page / home dengan hero section
- Navbar dengan semua menu
- Halaman Profil: tabs Visi/Misi/Tujuan, grid Pengajar dengan foto
- Halaman Galeri: masonry/grid foto dengan lightbox
- Halaman Informasi: daftar kartu artikel
- Halaman Prestasi: daftar prestasi dengan badge tingkat
- Halaman Kegiatan: daftar kegiatan dengan tanggal
- Halaman Kontak: info kontak + form kirim pesan
- Admin panel: login form, dashboard dengan tabel CRUD semua konten
- File upload untuk foto pengajar dan galeri
