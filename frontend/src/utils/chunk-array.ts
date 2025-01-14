export const chunkArray = (arr: any[], size: number) => {
  return Array.from({ length: Math.ceil(arr?.length / size) }, (_, i) => {
    return arr.slice(i * size, i * size + size);
  });
};
