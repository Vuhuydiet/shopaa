function numberAbbreviation(value: number): string {
  if (value < 1000) {
    return value.toString();
  }
  return (value / 1000).toFixed(1) + 'k';
}

export default numberAbbreviation;
