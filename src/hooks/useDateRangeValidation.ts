import { useState, useEffect } from "react";

export const useDateRangeValidation = (
  startDate: string,
  endDate: string,
  expectedRangeInDays: number
) => {
  const [isValidRange, setIsValidRange] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const differenceInDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      setIsValidRange(differenceInDays <= expectedRangeInDays && differenceInDays >= 0);
    } else {
      setIsValidRange(false);
    }
  }, [startDate, endDate, expectedRangeInDays]);

  return isValidRange;
};
