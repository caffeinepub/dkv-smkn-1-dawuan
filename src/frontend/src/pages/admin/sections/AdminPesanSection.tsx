import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { useAllPesan } from "../../../hooks/useQueries";
import { formatDate } from "../../../utils/dateUtils";

export default function AdminPesanSection() {
  const { data: pesan = [], isLoading } = useAllPesan();
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...pesan].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-brand-navy">
          Pesan Masuk
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Pesan dari pengunjung website
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada pesan masuk.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Badge className="bg-brand-navy/10 text-brand-navy">
              {sorted.length} Pesan
            </Badge>
          </div>
          {sorted.map((msg) => (
            <Card
              key={msg.id}
              className="cursor-pointer hover:shadow-card transition-shadow"
              onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-brand-navy/10 flex items-center justify-center shrink-0">
                      <span className="text-brand-navy font-bold text-sm">
                        {msg.nama.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm text-brand-navy">
                          {msg.nama}
                        </p>
                        <span className="text-muted-foreground text-xs flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {msg.email}
                        </span>
                      </div>
                      <p className="font-medium text-sm mt-0.5 line-clamp-1">
                        {msg.subjek}
                      </p>
                      {expanded !== msg.id && (
                        <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">
                          {msg.isi}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                      <Calendar className="w-3 h-3" />
                      {formatDate(msg.timestamp)}
                    </span>
                    {expanded === msg.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expanded === msg.id && (
                  <div className="mt-4 ml-12 pl-0">
                    <div className="bg-secondary rounded-lg p-4">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {msg.isi}
                      </p>
                    </div>
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subjek)}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 mt-3 text-sm text-brand-orange hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      Balas via Email
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
