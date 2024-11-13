import bcrypt from 'bcrypt';

function getHashedPassword(password: string): string {
  const salt = 10;

  return bcrypt.hashSync(password, salt);
  
}

function comparePassword(inputPassword: string, storedHash: string) {
  return bcrypt.compareSync(inputPassword, storedHash);
}

export { getHashedPassword, comparePassword };
