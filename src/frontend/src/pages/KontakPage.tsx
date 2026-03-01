import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useKontak, useSendPesan } from "../hooks/useQueries";

export default function KontakPage() {
  const { data: kontak, isLoading } = useKontak();
  const sendPesan = useSendPesan();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    subjek: "",
    isi: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.email || !form.subjek || !form.isi) {
      toast.error("Harap lengkapi semua field.");
      return;
    }
    try {
      await sendPesan.mutateAsync(form);
      setSent(true);
      setForm({ nama: "", email: "", subjek: "", isi: "" });
      toast.success("Pesan berhasil dikirim! Kami akan segera merespons.");
    } catch {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Alamat",
      value:
        kontak?.alamat || "Jl. Raya Dawuan, Kec. Dawuan, Karawang, Jawa Barat",
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Phone,
      label: "Telepon",
      value: kontak?.telepon || "(0267) 123456",
      color: "text-green-600 bg-green-50",
    },
    {
      icon: Mail,
      label: "Email",
      value: kontak?.email || "dkv@smkn1dawuan.sch.id",
      color: "text-brand-orange bg-orange-50",
    },
    {
      icon: Clock,
      label: "Jam Operasional",
      value: kontak?.jamOperasional || "Senin – Sabtu: 07.00 – 15.00 WIB",
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-navy py-10 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-brand-orange font-medium mb-2">Hubungi Kami</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Kontak
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl">
              Sampaikan pertanyaan atau pesan Anda kepada kami
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-display text-2xl font-bold text-brand-navy mb-6">
              Informasi Kontak
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <Card key={item.label} className="border-border/60">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-foreground font-medium text-sm">
                          {item.value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Map placeholder */}
            <div className="mt-6 rounded-xl overflow-hidden border border-border h-56 bg-secondary flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">SMKN 1 Dawuan</p>
                <p className="text-xs">Karawang, Jawa Barat</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-display text-2xl font-bold text-brand-navy mb-6">
              Kirim Pesan
            </h2>

            {sent ? (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-bold text-green-700 mb-2">
                    Pesan Terkirim!
                  </h3>
                  <p className="text-green-600 mb-6">
                    Terima kasih telah menghubungi kami. Kami akan merespons
                    pesan Anda secepatnya.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSent(false)}
                    className="border-green-400 text-green-700 hover:bg-green-100"
                  >
                    Kirim Pesan Lagi
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/60 shadow-card">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="nama"
                          className="text-sm font-medium mb-1.5 block"
                        >
                          Nama Lengkap *
                        </Label>
                        <Input
                          id="nama"
                          name="nama"
                          value={form.nama}
                          onChange={handleChange}
                          placeholder="Ahmad Fauzi"
                          required
                          className="focus-visible:ring-brand-orange"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium mb-1.5 block"
                        >
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="email@contoh.com"
                          required
                          className="focus-visible:ring-brand-orange"
                        />
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="subjek"
                        className="text-sm font-medium mb-1.5 block"
                      >
                        Subjek *
                      </Label>
                      <Input
                        id="subjek"
                        name="subjek"
                        value={form.subjek}
                        onChange={handleChange}
                        placeholder="Pertanyaan tentang pendaftaran..."
                        required
                        className="focus-visible:ring-brand-orange"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="isi"
                        className="text-sm font-medium mb-1.5 block"
                      >
                        Pesan *
                      </Label>
                      <Textarea
                        id="isi"
                        name="isi"
                        value={form.isi}
                        onChange={handleChange}
                        placeholder="Tuliskan pesan Anda di sini..."
                        rows={5}
                        required
                        className="focus-visible:ring-brand-orange resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={sendPesan.isPending}
                      className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white font-medium"
                    >
                      {sendPesan.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Kirim Pesan
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
