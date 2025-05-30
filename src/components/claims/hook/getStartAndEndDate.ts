export function getStartAndEndDate(claimType: string, year: number, quarter?: number, month?: number): { start_date: string; end_date: string } {
  if (!year) {
    throw new Error("Year is required to calculate start and end dates.");
  }

  if (claimType === "YEARLY") {
    return {
      start_date: `${year}-01-01`,
      end_date: `${year}-12-31`,
    };
  }

  if (claimType === "QUARTERLY" && quarter) {
    const quarterDates = {
      1: { start_date: `${year}-01-01`, end_date: `${year}-03-31` },
      2: { start_date: `${year}-04-01`, end_date: `${year}-06-30` },
      3: { start_date: `${year}-07-01`, end_date: `${year}-09-30` },
      4: { start_date: `${year}-10-01`, end_date: `${year}-12-31` },
    };
    return quarterDates[quarter];
  }

  if (claimType === "MONTHLY" && month) {
    const daysInMonth = (month === 2)
      ? (new Date(year, 1, 29).getDate() === 29 ? 29 : 28) // Check for leap year
      : [1, 3, 5, 7, 8, 10, 12].includes(month)
      ? 31
      : 30;

    return {
      start_date: `${year}-${String(month).padStart(2, "0")}-01`,
      end_date: `${year}-${String(month).padStart(2, "0")}-${daysInMonth}`,
    };
  }

  throw new Error("Invalid claim type or missing quarter/month.");
}