import { BadRequestError, InternalServerError } from "../core/ErrorResponse";
import prisma from "../prisma";
import { getHashedPassword, invalidatePassword } from "../utils/cryptoUtils";
import TokenService from "./token.service";
import UserService from "./user.service";

async function signUp({ username, password }: { username: string, password: string }) {
  const user = await prisma.userAccount.findUnique({
    where: { username }
  });
  if (user) {
    throw new BadRequestError('User already exists');
  }

  const newUser = await UserService.createUserAccount(username, getHashedPassword(password));
  if (!newUser) {
    throw new InternalServerError('User creation failed');
  }
}

async function signIn({ username, password }: { username: string, password: string }) {
  const user = await prisma.userAccount.findUnique({
    where: { username: username }
  });

  if (!user) {
    throw new BadRequestError('User does not exist');
  }

  if (!invalidatePassword(password, user.password)) {
    throw new BadRequestError('Invalid password');
  }

  const token = await TokenService.generateToken(user.userId);
  return token;
}

export default {
  signUp,
  signIn
};