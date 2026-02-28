import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Globe, Mail, MapPin, Phone, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useKontak, useUpdateKontak } from "../../../hooks/useQueries";

export default function AdminKontakSection() {
  const { data: kontak, isLoading } = useKontak();
  const updateKontak = useUpdateKontak();

  const [form, setForm] = useState({
    alamat: "",
    telepon: "",
    email: "",
    jamOperasional: "",
    koordinat: "",
  });

  useEffect(() => {
    if (kontak) {
      setForm({
        alamat: kontak.alamat || "",
        telepon: kontak.telepon || "",
        email: kontak.email || "",
        jamOperasional: kontak.jamOperasional || "",
        koordinat: kontak.koordinat || "",
      });
    }
  }, [kontak]);

  const handleSave = async () => {
    try {
      await updateKontak.mutateAsync(form);
      toast.success("Informasi kontak berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan kontak.");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  const fields = [
    {
      key: "alamat" as const,
      label: "Alamat",
      icon: MapPin,
      placeholder: "Jl. Raya Dawuan, Kec. Dawuan, Karawang...",
      multiline: true,
    },
    {
      key: "telepon" as const,
      label: "Nomor Telepon",
      icon: Phone,
      placeholder: "(0267) 123456",
    },
    {
      key: "email" as const,
      label: "Email",
      icon: Mail,
      placeholder: "dkv@smkn1dawuan.sch.id",
    },
    {
      key: "jamOperasional" as const,
      label: "Jam Operasional",
      icon: Clock,
      placeholder: "Senin–Sabtu: 07.00–15.00 WIB",
    },
    {
      key: "koordinat" as const,
      label: "Koordinat / URL Maps",
      icon: Globe,
      placeholder: "-6.123456, 107.123456",
    },
  ];

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-brand-navy">
          Kontak
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Kelola informasi kontak yang tampil di website
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Kontak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {fields.map((field) => (
            <div key={field.key}>
              <Label className="flex items-center gap-2 text-sm mb-1.5">
                <field.icon className="w-4 h-4 text-muted-foreground" />
                {field.label}
              </Label>
              {field.multiline ? (
                <Textarea
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  rows={2}
                  className="resize-none"
                />
              ) : (
                <Input
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          <Button
            onClick={handleSave}
            disabled={updateKontak.isPending}
            className="bg-brand-navy hover:bg-brand-navy/90 text-white"
          >
            {updateKontak.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Kontak
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
