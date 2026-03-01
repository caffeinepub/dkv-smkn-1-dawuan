import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    pengajarList : List.List<{
      id : Text;
      nama : Text;
      jabatan : Text;
      mataPelajaran : Text;
      bio : Text;
      fotoId : Text;
      urutan : Nat;
    }>;
    galeriList : List.List<{
      id : Text;
      judul : Text;
      deskripsi : Text;
      fotoId : Text;
      kategori : Text;
      tanggalUpload : Int;
    }>;
    informasiList : List.List<{
      id : Text;
      judul : Text;
      isi : Text;
      ringkasan : Text;
      tanggalPublish : Int;
      coverFotoId : Text;
      published : Bool;
    }>;
    prestasiList : List.List<{
      id : Text;
      judul : Text;
      deskripsi : Text;
      tahun : Nat;
      tingkat : { #sekolah; #kabupaten; #provinsi; #nasional; #internasional };
      fotoId : Text;
      siswa : Text;
    }>;
    kegiatanList : List.List<{
      id : Text;
      judul : Text;
      deskripsi : Text;
      tanggal : Int;
      lokasi : Text;
      fotoId : Text;
      status : { #upcoming; #ongoing; #done };
    }>;
    pesanList : List.List<{
      id : Text;
      nama : Text;
      email : Text;
      subjek : Text;
      isi : Text;
      timestamp : Int;
    }>;
    profil : ?{
      visi : Text;
      misi : Text;
      tujuan : Text;
    };
    kontak : ?{
      alamat : Text;
      telepon : Text;
      email : Text;
      jamOperasional : Text;
      koordinat : Text;
    };
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    pengajarList : List.List<{
      id : Text;
      nama : Text;
      jabatan : Text;
      mataPelajaran : Text;
      bio : Text;
      fotoId : Text;
      urutan : Nat;
    }>;
    galeriList : List.List<{
      id : Text;
      judul : Text;
      deskripsi : Text;
      fotoId : Text;
      kategori : Text;
      tanggalUpload : Int;
    }>;
    informasiList : List.List<{
      id : Text;
      judul : Text;
      isi : Text;
      ringkasan : Text;
      tanggalPublish : Int;
      coverFotoId : Text;
      published : Bool;
    }>;
    prestasiList : List.List<{
      id : Text;
      judul : Text;
      deskripsi : Text;
      tahun : Nat;
      tingkat : { #sekolah; #kabupaten; #provinsi; #nasional; #internasional };
      fotoId : Text;
      siswa : Text;
    }>;
    kegiatanList : List.List<{
      id : Text;
      judul : Text;
      deskripsi : Text;
      tanggal : Int;
      lokasi : Text;
      fotoId : Text;
      status : { #upcoming; #ongoing; #done };
    }>;
    pesanList : List.List<{
      id : Text;
      nama : Text;
      email : Text;
      subjek : Text;
      isi : Text;
      timestamp : Int;
    }>;
    profil : ?{
      visi : Text;
      misi : Text;
      tujuan : Text;
    };
    kontak : ?{
      alamat : Text;
      telepon : Text;
      email : Text;
      jamOperasional : Text;
      koordinat : Text;
    };
    adminCredentials : ?{
      username : Text;
      passwordHash : Text;
    };
    sessions : Map.Map<Text, {
      token : Text;
      createdAt : Int;
    }>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      adminCredentials = null;
      sessions = Map.empty<Text, { token : Text; createdAt : Int }>();
    };
  };
};
