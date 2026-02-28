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

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile
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

  // Profil Jurusan
  module Profil {
    public type T = {
      visi : Text;
      misi : Text;
      tujuan : Text;
    };
    public func compare(a : T, b : T) : Order.Order { #equal };
  };
  var profil : ?Profil.T = null;

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

  // Kontak
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

  //--------------------
  // Profil Jurusan
  //--------------------
  public shared ({ caller }) func updateProfil(visi : Text, misi : Text, tujuan : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update profile");
    };
    profil := ?{ visi; misi; tujuan };
  };

  public query ({ caller }) func getProfil() : async ?Profil.T {
    profil;
  };

  //--------------------
  // Pengajar
  //--------------------
  public shared ({ caller }) func addPengajar(pengajar : Pengajar.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add teachers");
    };
    pengajarList.add(pengajar);
  };

  public shared ({ caller }) func updatePengajar(id : Text, updated : Pengajar.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit teachers");
    };

    let newList = pengajarList.map<Pengajar.T, Pengajar.T>(
      func(p) { if (p.id == id) { updated } else { p } }
    );
    pengajarList.clear();
    pengajarList.addAll(newList.values());
  };

  public shared ({ caller }) func deletePengajar(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete teachers");
    };

    let newList = pengajarList.filter(func(p) { p.id != id });
    pengajarList.clear();
    pengajarList.addAll(newList.values());
  };

  public query ({ caller }) func getAllPengajar() : async [Pengajar.T] {
    pengajarList.toArray().sort(Pengajar.compareByUrutan);
  };

  //--------------------
  // Galeri
  //--------------------
  public shared ({ caller }) func addGaleri(galeri : Galeri.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add gallery");
    };
    galeriList.add(galeri);
  };

  public shared ({ caller }) func updateGaleri(id : Text, updated : Galeri.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update gallery");
    };

    let newList = galeriList.map<Galeri.T, Galeri.T>(
      func(g) { if (g.id == id) { updated } else { g } }
    );
    galeriList.clear();
    galeriList.addAll(newList.values());
  };

  public shared ({ caller }) func deleteGaleri(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete gallery");
    };

    let newList = galeriList.filter(func(g) { g.id != id });
    galeriList.clear();
    galeriList.addAll(newList.values());
  };

  public query ({ caller }) func getAllGaleri() : async [Galeri.T] {
    galeriList.toArray().sort(Galeri.compareByTanggal);
  };

  public query ({ caller }) func getGaleriByKategori(kategori : Text) : async [Galeri.T] {
    galeriList.filter(func(g) { g.kategori == kategori }).toArray();
  };

  //--------------------
  // Informasi
  //--------------------
  public shared ({ caller }) func addInformasi(informasi : Informasi.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add information");
    };
    informasiList.add(informasi);
  };

  public shared ({ caller }) func updateInformasi(id : Text, updated : Informasi.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update information");
    };

    let newList = informasiList.map<Informasi.T, Informasi.T>(
      func(i) { if (i.id == id) { updated } else { i } }
    );
    informasiList.clear();
    informasiList.addAll(newList.values());
  };

  public shared ({ caller }) func deleteInformasi(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete information");
    };

    let newList = informasiList.filter(func(i) { i.id != id });
    informasiList.clear();
    informasiList.addAll(newList.values());
  };

  public query ({ caller }) func getAllInformasi() : async [Informasi.T] {
    informasiList.toArray().sort(Informasi.compareByTanggal);
  };

  public query ({ caller }) func getPublishedInformasi() : async [Informasi.T] {
    informasiList.filter(func(i) { i.published }).toArray();
  };

  //--------------------
  // Prestasi
  //--------------------
  public shared ({ caller }) func addPrestasi(prestasi : Prestasi.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add achievements");
    };
    prestasiList.add(prestasi);
  };

  public shared ({ caller }) func updatePrestasi(id : Text, updated : Prestasi.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update achievements");
    };

    let newList = prestasiList.map<Prestasi.T, Prestasi.T>(
      func(p) { if (p.id == id) { updated } else { p } }
    );
    prestasiList.clear();
    prestasiList.addAll(newList.values());
  };

  public shared ({ caller }) func deletePrestasi(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete achievements");
    };

    let newList = prestasiList.filter(func(p) { p.id != id });
    prestasiList.clear();
    prestasiList.addAll(newList.values());
  };

  public query ({ caller }) func getAllPrestasi() : async [Prestasi.T] {
    prestasiList.toArray().sort(Prestasi.compareByTahun);
  };

  public query ({ caller }) func getPrestasiByTingkat(
    tingkat : { #sekolah; #kabupaten; #provinsi; #nasional; #internasional }
  ) : async [Prestasi.T] {
    prestasiList.filter(func(p) { p.tingkat == tingkat }).toArray();
  };

  //--------------------
  // Kegiatan
  //--------------------
  public shared ({ caller }) func addKegiatan(kegiatan : Kegiatan.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add activities");
    };
    kegiatanList.add(kegiatan);
  };

  public shared ({ caller }) func updateKegiatan(id : Text, updated : Kegiatan.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update activities");
    };

    let newList = kegiatanList.map<Kegiatan.T, Kegiatan.T>(
      func(k) { if (k.id == id) { updated } else { k } }
    );
    kegiatanList.clear();
    kegiatanList.addAll(newList.values());
  };

  public shared ({ caller }) func deleteKegiatan(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete activities");
    };

    let newList = kegiatanList.filter(func(k) { k.id != id });
    kegiatanList.clear();
    kegiatanList.addAll(newList.values());
  };

  public query ({ caller }) func getAllKegiatan() : async [Kegiatan.T] {
    kegiatanList.toArray().sort(Kegiatan.compareByTanggal);
  };

  public query ({ caller }) func getKegiatanByStatus(
    status : { #upcoming; #ongoing; #done }
  ) : async [Kegiatan.T] {
    kegiatanList.filter(func(k) { k.status == status }).toArray();
  };

  //--------------------
  // Kontak
  //--------------------
  public shared ({ caller }) func updateKontak(
    alamat : Text,
    telepon : Text,
    email : Text,
    jamOperasional : Text,
    koordinat : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update contact info");
    };
    kontak := ?{ alamat; telepon; email; jamOperasional; koordinat };
  };

  public query ({ caller }) func getKontak() : async ?Kontak.T {
    kontak;
  };

  public shared ({ caller }) func sendPesan(
    nama : Text,
    email : Text,
    subjek : Text,
    isi : Text,
    timestamp : Time.Time,
  ) : async () {
    let id = timestamp.toText() # " " # nama;
    let pesan : Pesan.T = { id; nama; email; subjek; isi; timestamp };
    pesanList.add(pesan);
  };

  public query ({ caller }) func getAllPesan() : async [Pesan.T] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view messages");
    };
    pesanList.toArray().sort(Pesan.compareByTimestamp);
  };
};
