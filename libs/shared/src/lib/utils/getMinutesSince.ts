export const getMinutesSince = (dateStr: string | Date) => {
  const created = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  return diffMs / (1000 * 60); 
};
