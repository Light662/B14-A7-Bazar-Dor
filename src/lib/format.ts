const bengaliDigits = "০১২৩৪৫৬৭৮৯";
const latinDigits = "0123456789";

export function formatBengaliNumber(
  value: number,
  maximumFractionDigits = 0,
): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(value);
}

export function parseLocalizedNumber(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }

  const latinValue = [...value]
    .map((character) => {
      const index = bengaliDigits.indexOf(character);
      return index === -1 ? character : latinDigits[index];
    })
    .join("")
    .replace(/[٬,]/g, "")
    .replace("٫", ".");

  return Number(latinValue);
}

export function formatPrice(value: number): string {
  return `${formatBengaliNumber(value)} টাকা`;
}

export function formatUnit(unit: string): string {
  const labels: Record<string, string> = {
    kg: "কেজি",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "টি",
  };

  return labels[unit] ?? unit;
}

export function getPriceMovement(change: { dir: string; pct: number }) {
  if (change.dir === "up") {
    return { label: "up" as const, arrow: "▲", percent: Math.abs(change.pct) };
  }
  if (change.dir === "down") {
    return { label: "down" as const, arrow: "▼", percent: Math.abs(change.pct) };
  }
  return { label: "flat" as const, arrow: "•", percent: Math.abs(change.pct) };
}
