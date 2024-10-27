
// Generate a 6-digit OTP
function generateOtp(start: number = 100000, end: number = 999999): number {
  return Math.floor(start + Math.random() * (end - start + 1));
}

export { generateOtp };