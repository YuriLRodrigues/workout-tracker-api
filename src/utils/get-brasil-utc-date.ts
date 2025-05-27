export const getBrasilUTCDate = () => {
  const now = new Date();
  const brasilTime = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  return brasilTime;
};

export const getBrasilDayRange = () => {
  const brasilNow = getBrasilUTCDate();

  const start = new Date(brasilNow.getFullYear(), brasilNow.getMonth(), brasilNow.getDate(), 0, 0, 0, 0);

  const end = new Date(brasilNow.getFullYear(), brasilNow.getMonth(), brasilNow.getDate(), 23, 59, 59, 999);

  return { start, end };
};
