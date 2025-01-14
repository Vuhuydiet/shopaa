export const serializeDate = (date: Date): string => {
  return date.toISOString();
};

export const deserializeDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const getDateFormatted = (date: Date): string => {
  return date.toLocaleString();
};

export const stringToISOString = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString();
};
