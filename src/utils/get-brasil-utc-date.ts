import { startOfDay, endOfDay } from 'date-fns';

export const getBrasilUTCDate = () => {
  return new Date();
};

export const getBrasilDayRange = () => {
  const now = new Date();
  const start = startOfDay(now);
  const end = endOfDay(now);

  return { start, end };
};
