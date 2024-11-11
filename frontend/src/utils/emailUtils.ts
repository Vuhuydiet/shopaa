export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');

  if (username.length <= 3) {
    return email;
  }

  // Giữ hai ký tự đầu của username, ẩn các ký tự ở giữa
  const startChars = username.slice(0, 2);
  const maskedUsername = startChars + '*'.repeat(username.length - 2);

  return `${maskedUsername}@${domain}`;
};
