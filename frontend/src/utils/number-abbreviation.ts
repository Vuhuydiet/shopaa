
function numberAbbreviation(value: number): string {
    return (value / 1000).toFixed(1) + 'k';
}

export default numberAbbreviation;