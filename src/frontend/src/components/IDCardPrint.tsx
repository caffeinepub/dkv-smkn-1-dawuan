import { GraduationCap, MapPin, Printer } from "lucide-react";
import { useEffect, useRef } from "react";
import { ExternalBlob } from "../backend";
import type { Siswa } from "../hooks/useQueries";
import { Status } from "../hooks/useQueries";
import { useSiteLogo } from "../hooks/useSiteLogo";

interface IDCardProps {
  siswa: Siswa;
  onClose: () => void;
}

function IDCardFace({ siswa, logoUrl }: { siswa: Siswa; logoUrl: string }) {
  const fotoUrl = siswa.fotoId
    ? ExternalBlob.fromURL(siswa.fotoId).getDirectURL()
    : null;

  const isAktif = siswa.status === Status.aktif;

  return (
    <div
      className="id-card"
      style={{
        width: "85.6mm",
        height: "54mm",
        background:
          "linear-gradient(135deg, #0f2341 0%, #1a3a6b 60%, #0f2341 100%)",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        border: "0.5px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: "6px",
          background:
            "linear-gradient(180deg, #e07020 0%, #ff8c3a 50%, #e07020 100%)",
          flexShrink: 0,
        }}
      />

      {/* Decorative circles background */}
      <div
        style={{
          position: "absolute",
          top: "-20px",
          right: "60px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          zIndex: 0,
        }}
      />

      {/* Photo area */}
      <div
        style={{
          width: "44mm",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px 6px 6px 8px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo + School name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "5px",
            width: "100%",
          }}
        >
          <img
            src={logoUrl}
            alt="Logo"
            style={{ width: "18px", height: "18px", objectFit: "contain" }}
          />
          <div>
            <p
              style={{
                fontSize: "6px",
                color: "#e07020",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                lineHeight: 1,
              }}
            >
              SMKN 1 Dawuan
            </p>
            <p
              style={{
                fontSize: "5px",
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1,
                marginTop: "1px",
              }}
            >
              Komp. Desa Dawuan Tengah
            </p>
          </div>
        </div>

        {/* Photo */}
        <div
          style={{
            width: "30mm",
            height: "30mm",
            borderRadius: "4px",
            overflow: "hidden",
            border: "2px solid rgba(224,112,32,0.8)",
            background: "rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt={siswa.nama}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              crossOrigin="anonymous"
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <GraduationCap size={20} color="rgba(255,255,255,0.3)" />
              <span style={{ fontSize: "5px", color: "rgba(255,255,255,0.3)" }}>
                No Photo
              </span>
            </div>
          )}
        </div>

        {/* Status badge */}
        <div
          style={{
            marginTop: "4px",
            padding: "2px 8px",
            borderRadius: "10px",
            background: isAktif
              ? "rgba(34,197,94,0.25)"
              : "rgba(251,146,60,0.25)",
            border: `1px solid ${isAktif ? "rgba(34,197,94,0.6)" : "rgba(251,146,60,0.6)"}`,
          }}
        >
          <span
            style={{
              fontSize: "5.5px",
              color: isAktif ? "#86efac" : "#fdba74",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {isAktif ? "SISWA AKTIF" : "ALUMNI"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "1px",
          background:
            "linear-gradient(180deg, transparent, rgba(255,255,255,0.15), transparent)",
          margin: "8px 0",
          alignSelf: "stretch",
          zIndex: 1,
        }}
      />

      {/* Info area */}
      <div
        style={{
          flex: 1,
          padding: "8px 10px 8px 8px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* Header label */}
        <div>
          <p
            style={{
              fontSize: "7px",
              color: "#e07020",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "6px",
            }}
          >
            KARTU IDENTITAS SISWA
          </p>

          {/* Name */}
          <p
            style={{
              fontSize: "10px",
              color: "#ffffff",
              fontWeight: "bold",
              lineHeight: 1.2,
              marginBottom: "5px",
              wordBreak: "break-word",
            }}
          >
            {siswa.nama}
          </p>

          {/* Data fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            <DataRow label="NISN" value={siswa.nisn} />
            <DataRow label="Kelas" value={siswa.kelas} />
            <DataRow label="Jurusan" value={siswa.jurusan} />
            <DataRow label="Angkatan" value={String(siswa.angkatan)} />
          </div>
        </div>

        {/* Bottom: alamat + barcode placeholder */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "6px",
          }}
        >
          {siswa.alamat && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "2px",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <MapPin
                size={7}
                color="rgba(255,255,255,0.4)"
                style={{ marginTop: "1px", flexShrink: 0 }}
              />
              <p
                style={
                  {
                    fontSize: "5.5px",
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  } as React.CSSProperties
                }
              >
                {siswa.alamat}
              </p>
            </div>
          )}

          {/* Barcode lines decoration */}
          <div
            style={{
              display: "flex",
              gap: "1.5px",
              alignItems: "flex-end",
              flexShrink: 0,
            }}
          >
            {[4, 7, 5, 9, 6, 8, 5, 7, 4, 6, 8, 5, 7].map((h, i) => (
              <div
                key={`bar-${i}-${h}`}
                style={{
                  width: "1.5px",
                  height: `${h}px`,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: "0.5px",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right edge detail */}
      <div
        style={{
          width: "4px",
          background: "rgba(255,255,255,0.05)",
          flexShrink: 0,
        }}
      />
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "baseline" }}>
      <span
        style={{
          fontSize: "5.5px",
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
          minWidth: "32px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "5.5px",
          color: "rgba(255,255,255,0.3)",
          flexShrink: 0,
        }}
      >
        :
      </span>
      <span
        style={{
          fontSize: "6px",
          color: "rgba(255,255,255,0.85)",
          fontWeight: "500",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const PRINT_STYLE_ID = "id-card-print-styles";

export default function IDCardPrint({ siswa, onClose }: IDCardProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const { logoUrl } = useSiteLogo();

  // Inject print styles without dangerouslySetInnerHTML
  useEffect(() => {
    if (document.getElementById(PRINT_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = PRINT_STYLE_ID;
    style.textContent = [
      "@media print {",
      "  @page { size: A4 landscape; margin: 10mm; }",
      "  body { background: white !important; }",
      "  .print-grid {",
      "    display: grid !important;",
      "    grid-template-columns: repeat(3, 85.6mm) !important;",
      "    gap: 8mm !important;",
      "    justify-content: center !important;",
      "    padding: 0 !important;",
      "  }",
      "  .print-card { break-inside: avoid !important; }",
      "  .id-card-label { display: block !important; }",
      "}",
      ".id-card-label { display: none; }",
    ].join("\n");
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(PRINT_STYLE_ID);
      if (el) el.remove();
    };
  }, []);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank", "width=900,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ID Card - ${siswa.nama}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #f5f5f5;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .print-wrapper {
              display: grid;
              grid-template-columns: repeat(3, auto);
              gap: 8mm;
              padding: 10mm;
            }
            .card-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 4mm;
            }
            .card-label {
              font-family: Arial, sans-serif;
              font-size: 8pt;
              color: #666;
              text-align: center;
            }
            @media print {
              body { background: white; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div>
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">Cetak ID Card</h2>
            <p className="text-sm text-muted-foreground">
              Orientasi landscape (miring) - ukuran kartu standar 85.6 x 54mm
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            ×
          </button>
        </div>

        {/* Preview */}
        <div className="p-6">
          <p className="text-xs text-muted-foreground mb-4 text-center">
            Pratinjau ID Card (orientasi landscape / miring)
          </p>

          {/* Card preview - landscape orientation */}
          <div className="flex justify-center mb-6">
            <div ref={printRef}>
              {/* 3x2 grid for print - shows 3 copies on first row for print efficiency */}
              <div
                className="print-grid"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {/* Single card preview */}
                <div
                  className="print-card"
                  style={{
                    transform: "scale(1.2)",
                    transformOrigin: "top center",
                    marginBottom: "8px",
                  }}
                >
                  <IDCardFace siswa={siswa} logoUrl={logoUrl} />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Ukuran sebenarnya: 85.6 × 54 mm (landscape)
                </p>
              </div>
            </div>
          </div>

          {/* Print info */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-700 mb-4">
            <p className="font-medium mb-1">Tips cetak:</p>
            <ul className="list-disc list-inside space-y-0.5 text-blue-600">
              <li>Halaman akan dicetak dalam orientasi landscape (miring)</li>
              <li>Pilih ukuran kertas A4 di dialog cetak printer</li>
              <li>Aktifkan "Print backgrounds" / "Cetak latar" di browser</li>
              <li>Gunakan scale 100% untuk ukuran kartu yang tepat</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2 rounded-lg bg-brand-navy text-white text-sm font-medium hover:bg-brand-navy/90 transition-colors flex items-center gap-2"
            >
              <Printer size={14} aria-hidden="true" />
              Cetak ID Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
