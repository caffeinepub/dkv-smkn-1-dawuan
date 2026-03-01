# DKV SMKN 1 Dawuan

## Current State

Website jurusan DKV SMKN 1 Dawuan dengan halaman publik (Beranda, Profil, Galeri, Informasi, Prestasi, Kegiatan, Kontak) dan panel admin. Login admin saat ini menggunakan Internet Identity (ICP) yang tidak familiar bagi pengguna awam dan menyebabkan masalah akses.

## Requested Changes (Diff)

### Add
- Backend: fungsi `adminLogin(username, password)` yang mengembalikan session token jika credential valid
- Backend: fungsi `adminLogout(token)` untuk menghapus session
- Backend: fungsi `verifyAdminSession(token)` untuk memeriksa validitas session
- Backend: fungsi `setAdminCredentials(username, password, adminToken)` untuk mengatur username/password awal (dipanggil dengan admin token Caffeine)
- Frontend: form login username + password di halaman `/admin`
- Frontend: session token disimpan di localStorage/sessionStorage
- Hook `useAdminSession` untuk mengelola status login berbasis token

### Modify
- Backend: `isCallerAdmin()` tetap ada, tapi tambah jalur autentikasi berbasis session token
- Frontend: `AdminPage.tsx` -- ganti UI Internet Identity dengan form username/password
- Frontend: `AdminDashboard.tsx` -- ganti pengecekan identity dengan pengecekan session token
- Frontend: `useActor.ts` -- actor tetap anonim, session token dikirim via fungsi backend
- Frontend: `useQueries.ts` -- fungsi admin menggunakan session token bukan identity

### Remove
- Frontend: semua referensi ke `useInternetIdentity` di halaman admin
- Frontend: logika "klaim akses dengan token" yang membingungkan

## Implementation Plan

1. Tambah fungsi backend: `adminLogin`, `adminLogout`, `verifyAdminSession`, `setAdminCredentials`, `isSessionAdmin` di main.mo
2. Buat hook `useAdminAuth` di frontend untuk mengelola state login username/password
3. Redesain `AdminPage.tsx` dengan form username/password yang clean
4. Update `AdminDashboard.tsx` agar menggunakan session token (bukan Internet Identity)
5. Update semua query admin di `useQueries.ts` untuk menyertakan token session
6. Pastikan actor tetap anonim tapi semua operasi admin melewati verifikasi token session di backend
