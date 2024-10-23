export * from "./random";
export * from "./map";
export * from "./uploads";

export const handlePrice = (billDate: Date, priceDefault: number, typeCard: boolean): number => {
  const now = new Date();
  const billTime = new Date(billDate);

  const cutoffTime = new Date(billTime);
  cutoffTime.setHours(18, 0, 0, 0);

  let price = priceDefault || 3000;

  if (billTime <= cutoffTime && now > cutoffTime && now.getDate() === billTime.getDate()) {
    price = 5000;
  }

  const midnight = new Date(billTime);
  midnight.setHours(24, 0, 0, 0);

  let totalNights = 0;

  while (midnight <= now) {
    totalNights += 1;
    midnight.setDate(midnight.getDate() + 1);
  }

  if (totalNights > 0) {
    price = 10000 * totalNights;
  }

  if (typeCard) return price;

  return price + priceDefault;
};
