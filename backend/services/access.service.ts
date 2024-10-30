import { BadRequestError, InternalServerError } from "../core/ErrorResponse";
import prisma from "../prisma";
import { getHashedPassword, invalidatePassword } from "../utils/cryptoUtils";
import TokenService from "./token.service";
import UserService from "./user.service";

async function signUp(username: string, password: string, email: string) {
  let user = await prisma.userAccount.findUnique({
    where: { username }
  });
  if (user) {
    throw new BadRequestError('User already exists');
  }
  user = await prisma.userAccount.findUnique({
    where: {email}
  });
  if (user) {
    throw new BadRequestError('Email has already been reegistered');
  }

  const newUser = await UserService.createUserAccount(username, getHashedPassword(password), email);
  if (!newUser) {
    throw new InternalServerError('User creation failed');
  }
}

async function signIn(username: string, password: string) {
  const user = await prisma.userAccount.findUnique({
    where: { username: username }
  });

  if (!user) {
    throw new BadRequestError('User does not exist');
  }

  if (!invalidatePassword(password, user.password)) {
    throw new BadRequestError('Invalid password');
  }

  const token = TokenService.generateToken(user.userId);
  return token;
}

async function changePassword(userId: number, newPassword: string) {
  const user = await prisma.userAccount.findUnique({
    where: { userId }
  });

  if (!user) {
    throw new BadRequestError('User does not exist');
  }

  await prisma.userAccount.update({
    where: { userId },
    data: { password: getHashedPassword(newPassword) }
  });
}

export default {
  signUp,
  signIn,
  changePassword
};