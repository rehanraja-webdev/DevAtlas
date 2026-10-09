export const getPreviousWeekPeriod = (now = new Date()) => {
  const periodEnd = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  // Monday is the beginning of our reporting week.
  const daysSinceMonday = (periodEnd.getUTCDay() + 6) % 7;

  periodEnd.setUTCDate(periodEnd.getUTCDate() - daysSinceMonday);

  const periodStart = new Date(periodEnd);

  periodStart.setUTCDate(periodStart.getUTCDate() - 7);

  return {
    periodStart,
    periodEnd,
  };
};
