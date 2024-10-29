export const calculateTotalCostOfStay = (
  startDate: Date,
  endDate: Date,
  pricePerNight: number
): number => {
  const x = new Date(startDate);
  const y = new Date(endDate);
  const timeDifference = x.getTime() - y.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  return daysDifference * pricePerNight;
};
