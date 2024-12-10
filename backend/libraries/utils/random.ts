
// Generate a 6-digit OTP
function generateOtp(start: number = 100000, end: number = 999999): number {
  return Math.floor(start + Math.random() * (end - start + 1));
}

function generateAccessKey(): string {
  // return random hex string
  return [...Array(16)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');
}

export { generateOtp, generateAccessKey };
