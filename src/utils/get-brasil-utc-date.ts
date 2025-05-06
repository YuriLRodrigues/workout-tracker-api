import { startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const getBrasilUTCDate = () => {
  const timeZone = 'America/Sao_Paulo';

  const utcDate = toZonedTime(new Date(), timeZone);

  return utcDate;
};

export const getBrasilDayRange = () => {
  const timeZone = 'America/Sao_Paulo';

  const now = new Date();
  const start = toZonedTime(startOfDay(now), timeZone);
  const end = toZonedTime(endOfDay(now), timeZone);

  return { start, end };
};
