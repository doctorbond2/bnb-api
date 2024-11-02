export const calculateTotalCostOfStay = (
  startDate: Date,
  endDate: Date,
  pricePerNight: number
): number => {
  const x = new Date(startDate);
  const y = new Date(endDate);
  const timeDifference = y.getTime() - x.getTime();
  const daysDifference = timeDifference / (1000 * 3600 * 24);
  if (timeDifference < 0) {
    throw new Error('End date must be after start date.');
  }
  return daysDifference * pricePerNight;
};
