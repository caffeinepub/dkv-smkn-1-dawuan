import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Iter "mo:core/Iter";

import Random "mo:core/Random";
import Blob "mo:core/Blob";


actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile (for Caffeine compatibility)
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ============================================
  // Session-based Authentication System
  // ============================================

  type AdminCredentials = {
    username : Text;
    passwordHash : Text;
  };

  // Profil Jurusan (Now stable)
  module Profil {
    public type T = {
      visi : Text;
      misi : Text;
      tujuan : Text;
    };
    public func compare(a : T, b : T) : Order.Order { #equal };
  };
  var profil : ?Profil.T = null;

  // Kontak (Now stable)
  module Kontak {
    public type T = {
      alamat : Text;
      telepon : Text;
      email : Text;
      jamOperasional : Text;
      koordinat : Text;
    };
    public func compare(a : T, b : T) : Order.Order { #equal };
  };
  var kontak : ?Kontak.T = null;

  type Session = {
    token : Text;
    createdAt : Time.Time;
  };

  var adminCredentials : ?AdminCredentials = null;
  let sessions = Map.empty<Text, Session>();
  let SESSION_DURATION : Int = 24 * 60 * 60 * 1_000_000_000; // 24 hours in nanoseconds

  // Simple hash function (in production, use proper cryptographic hash)
  func hashPassword(password : Text) : Text {
    let bytes = password.encodeUtf8().toArray();
    var hash : Nat = 0;
    for (b in bytes.vals()) {
      hash := (hash * 31 + Nat8.toNat(b)) % 1_000_000_007;
    };
    hash.toText();
  };

  // Generate random session token
  func generateSessionToken() : async Text {
    let entropy = await Random.blob();
    let bytes = entropy.toArray();
    var token = "";
    for (b in bytes.vals()) {
      token #= Nat8.toText(b);
    };
    token # Time.now().toText();
  };

  // Validate session token
  func isSessionValidInternal(sessionToken : Text) : Bool {
    switch (sessions.get(sessionToken)) {
      case null { false };
      case (?session) {
        let now = Time.now();
        let elapsed = now - session.createdAt;
        elapsed < SESSION_DURATION;
      };
    };
  };

  // Admin login
  public shared func adminLogin(username : Text, password : Text) : async { #ok : Text; #err : Text } {
    let passwordHash = hashPassword(password);

    switch (adminCredentials) {
      case null {
        // Use default credentials
        if (username == "admin" and password == "dkv2024") {
          let token = await generateSessionToken();
          let session : Session = {
            token = token;
            createdAt = Time.now();
          };
          sessions.add(token, session);
          #ok(token);
        } else {
          #err("Invalid credentials");
        };
      };
      case (?creds) {
        if (username == creds.username and passwordHash == creds.passwordHash) {
          let token = await generateSessionToken();
          let session : Session = {
            token = token;
            createdAt = Time.now();
          };
          sessions.add(token, session);
          #ok(token);
        } else {
          #err("Invalid credentials");
        };
      };
    };
  };

  // Admin logout
  public shared func adminLogout(sessionToken : Text) : async () {
    sessions.remove(sessionToken);
  };

  // Check if session is valid
  public query func isSessionValid(sessionToken : Text) : async Bool {
    isSessionValidInternal(sessionToken);
  };

  // Set admin credentials (requires Caffeine admin token or valid session)
  public shared ({ caller }) func setAdminCredentials(
    username : Text,
    password : Text,
    caffeineAdminToken : Text,
  ) : async { #ok; #err : Text } {
    // Check if caller is admin via Caffeine system OR has valid session token
    let isCaffeineAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isValidSession = isSessionValidInternal(caffeineAdminToken);

    if (not isCaffeineAdmin and not isValidSession) {
      return #err("Unauthorized: Admin access required");
    };

    let passwordHash = hashPassword(password);
    adminCredentials := ?{
      username = username;
      passwordHash = passwordHash;
    };
    #ok;
  };

  // ============================================
  // Data Types
  // ============================================

  // Pengajar
  module Pengajar {
    public type T = {
      id : Text;
      nama : Text;
      jabatan : Text;
      mataPelajaran : Text;
      bio : Text;
      fotoId : Text;
      urutan : Nat;
    };

    public func compareByUrutan(a : T, b : T) : Order.Order {
      Nat.compare(a.urutan, b.urutan);
    };
  };

  let pengajarList = List.empty<Pengajar.T>();

  // Galeri
  module Galeri {
    public type T = {
      id : Text;
      judul : Text;
      deskripsi : Text;
      fotoId : Text;
      kategori : Text;
      tanggalUpload : Time.Time;
    };

    public func compareByTanggal(a : T, b : T) : Order.Order {
      Int.compare(a.tanggalUpload, b.tanggalUpload);
    };
  };

  let galeriList = List.empty<Galeri.T>();

  // Informasi
  module Informasi {
    public type T = {
      id : Text;
      judul : Text;
      isi : Text;
      ringkasan : Text;
      tanggalPublish : Time.Time;
      coverFotoId : Text;
      published : Bool;
    };

    public func compareByTanggal(a : T, b : T) : Order.Order {
      Int.compare(a.tanggalPublish, b.tanggalPublish);
    };
  };

  let informasiList = List.empty<Informasi.T>();

  // Prestasi
  module Prestasi {
    public type T = {
      id : Text;
      judul : Text;
      deskripsi : Text;
      tahun : Nat;
      tingkat : { #sekolah; #kabupaten; #provinsi; #nasional; #internasional };
      fotoId : Text;
      siswa : Text;
    };

    public func compareByTahun(a : T, b : T) : Order.Order {
      Nat.compare(a.tahun, b.tahun);
    };
  };

  let prestasiList = List.empty<Prestasi.T>();

  // Kegiatan
  module Kegiatan {
    public type T = {
      id : Text;
      judul : Text;
      deskripsi : Text;
      tanggal : Time.Time;
      lokasi : Text;
      fotoId : Text;
      status : { #upcoming; #ongoing; #done };
    };

    public func compareByTanggal(a : T, b : T) : Order.Order {
      Int.compare(a.tanggal, b.tanggal);
    };
  };

  let kegiatanList = List.empty<Kegiatan.T>();

  // Pesan Kontak
  module Pesan {
    public type T = {
      id : Text;
      nama : Text;
      email : Text;
      subjek : Text;
      isi : Text;
      timestamp : Time.Time;
    };

    public func compareByTimestamp(a : T, b : T) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let pesanList = List.empty<Pesan.T>();

  // ============================================
  // Profil Jurusan
  // ============================================

  public shared func updateProfil(sessionToken : Text, visi : Text, misi : Text, tujuan : Text) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };
    profil := ?{ visi; misi; tujuan };
  };

  public query func getProfil() : async ?Profil.T {
    profil;
  };

  // ============================================
  // Pengajar
  // ============================================

  public shared func addPengajar(sessionToken : Text, pengajar : Pengajar.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };
    pengajarList.add(pengajar);
  };

  public shared func updatePengajar(sessionToken : Text, id : Text, updated : Pengajar.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = pengajarList.map<Pengajar.T, Pengajar.T>(
      func(p) { if (p.id == id) { updated } else { p } }
    );
    pengajarList.clear();
    pengajarList.addAll(newList.values());
  };

  public shared func deletePengajar(sessionToken : Text, id : Text) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = pengajarList.filter(func(p) { p.id != id });
    pengajarList.clear();
    pengajarList.addAll(newList.values());
  };

  public query func getAllPengajar() : async [Pengajar.T] {
    pengajarList.toArray().sort(Pengajar.compareByUrutan);
  };

  // ============================================
  // Galeri
  // ============================================

  public shared func addGaleri(sessionToken : Text, galeri : Galeri.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };
    galeriList.add(galeri);
  };

  public shared func updateGaleri(sessionToken : Text, id : Text, updated : Galeri.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = galeriList.map<Galeri.T, Galeri.T>(
      func(g) { if (g.id == id) { updated } else { g } }
    );
    galeriList.clear();
    galeriList.addAll(newList.values());
  };

  public shared func deleteGaleri(sessionToken : Text, id : Text) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = galeriList.filter(func(g) { g.id != id });
    galeriList.clear();
    galeriList.addAll(newList.values());
  };

  public query func getAllGaleri() : async [Galeri.T] {
    galeriList.toArray().sort(Galeri.compareByTanggal);
  };

  public query func getGaleriByKategori(kategori : Text) : async [Galeri.T] {
    galeriList.filter(func(g) { g.kategori == kategori }).toArray();
  };

  // ============================================
  // Informasi
  // ============================================

  public shared func addInformasi(sessionToken : Text, informasi : Informasi.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };
    informasiList.add(informasi);
  };

  public shared func updateInformasi(sessionToken : Text, id : Text, updated : Informasi.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = informasiList.map<Informasi.T, Informasi.T>(
      func(i) { if (i.id == id) { updated } else { i } }
    );
    informasiList.clear();
    informasiList.addAll(newList.values());
  };

  public shared func deleteInformasi(sessionToken : Text, id : Text) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = informasiList.filter(func(i) { i.id != id });
    informasiList.clear();
    informasiList.addAll(newList.values());
  };

  public query func getAllInformasi(sessionToken : Text) : async [Informasi.T] {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };
    informasiList.toArray().sort(Informasi.compareByTanggal);
  };

  public query func getPublishedInformasi() : async [Informasi.T] {
    informasiList.filter(func(i) { i.published }).toArray();
  };

  // ============================================
  // Prestasi
  // ============================================

  public shared func addPrestasi(sessionToken : Text, prestasi : Prestasi.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };
    prestasiList.add(prestasi);
  };

  public shared func updatePrestasi(sessionToken : Text, id : Text, updated : Prestasi.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = prestasiList.map<Prestasi.T, Prestasi.T>(
      func(p) { if (p.id == id) { updated } else { p } }
    );
    prestasiList.clear();
    prestasiList.addAll(newList.values());
  };

  public shared func deletePrestasi(sessionToken : Text, id : Text) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = prestasiList.filter(func(p) { p.id != id });
    prestasiList.clear();
    prestasiList.addAll(newList.values());
  };

  public query func getAllPrestasi() : async [Prestasi.T] {
    prestasiList.toArray().sort(Prestasi.compareByTahun);
  };

  public query func getPrestasiByTingkat(
    tingkat : { #sekolah; #kabupaten; #provinsi; #nasional; #internasional }
  ) : async [Prestasi.T] {
    prestasiList.filter(func(p) { p.tingkat == tingkat }).toArray();
  };

  // ============================================
  // Kegiatan
  // ============================================

  public shared func addKegiatan(sessionToken : Text, kegiatan : Kegiatan.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };
    kegiatanList.add(kegiatan);
  };

  public shared func updateKegiatan(sessionToken : Text, id : Text, updated : Kegiatan.T) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = kegiatanList.map<Kegiatan.T, Kegiatan.T>(
      func(k) { if (k.id == id) { updated } else { k } }
    );
    kegiatanList.clear();
    kegiatanList.addAll(newList.values());
  };

  public shared func deleteKegiatan(sessionToken : Text, id : Text) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };

    let newList = kegiatanList.filter(func(k) { k.id != id });
    kegiatanList.clear();
    kegiatanList.addAll(newList.values());
  };

  public query func getAllKegiatan() : async [Kegiatan.T] {
    kegiatanList.toArray().sort(Kegiatan.compareByTanggal);
  };

  public query func getKegiatanByStatus(
    status : { #upcoming; #ongoing; #done }
  ) : async [Kegiatan.T] {
    kegiatanList.filter(func(k) { k.status == status }).toArray();
  };

  // ============================================
  // Kontak
  // ============================================

  public shared func updateKontak(
    sessionToken : Text,
    alamat : Text,
    telepon : Text,
    email : Text,
    jamOperasional : Text,
    koordinat : Text,
  ) : async () {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };
    kontak := ?{ alamat; telepon; email; jamOperasional; koordinat };
  };

  public query func getKontak() : async ?Kontak.T {
    kontak;
  };

  // ============================================
  // Pesan
  // ============================================

  public shared func sendPesan(
    nama : Text,
    email : Text,
    subjek : Text,
    isi : Text,
    timestamp : Time.Time,
  ) : async () {
    let id = timestamp.toText() # "-" # nama;
    let pesan : Pesan.T = { id; nama; email; subjek; isi; timestamp };
    pesanList.add(pesan);
  };

  public query func getAllPesan(sessionToken : Text) : async [Pesan.T] {
    if (not isSessionValidInternal(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid or expired session token");
    };
    pesanList.toArray().sort(Pesan.compareByTimestamp);
  };
};
