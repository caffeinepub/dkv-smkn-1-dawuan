export function formatDate(time: bigint): string {
  return new Date(Number(time / 1_000_000n)).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(time: bigint): string {
  return new Date(Number(time / 1_000_000n)).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function nowNano(): bigint {
  return BigInt(Date.now()) * 1_000_000n;
}

export function dateToNano(date: string): bigint {
  return BigInt(new Date(date).getTime()) * 1_000_000n;
}

export function nanoToDateInput(time: bigint): string {
  const d = new Date(Number(time / 1_000_000n));
  return d.toISOString().split("T")[0];
}
