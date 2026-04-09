export const isTime = (value: string) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(value);
};

export const isIsoTime = (value: string) => {
  const isoTimeRegex = /^\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return isoTimeRegex.test(value);
};
