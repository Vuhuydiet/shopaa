export function capitalizeWords(str: string | undefined): string {
  if (!str) return '';

  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
