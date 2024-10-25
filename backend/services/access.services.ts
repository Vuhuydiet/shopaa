import { BadRequestError, InternalServerError } from "../core/ErrorResponse";
import { CreatedResponse } from "../core/SuccessResponse";
import prisma from "../prisma";
import { invalidatePassword } from "../utils/cryptoUtils";
import TokenService from "./token.service";

async function signUp({ username, password }: { username: string, password: string }) {
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (user) {
    throw new BadRequestError('User already exists');
  }

  const newUser = prisma.user.create({
    data: {
      username,
      password
    }
  });

  if (!newUser) {
    throw new InternalServerError('User creation failed');
  }

  return new CreatedResponse({ message: 'User created successfully' });
}

async function signIn({ username, password }: { username: string, password: string }) {
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    throw new BadRequestError('User does not exist');
  }

  if (invalidatePassword(password, user.password)) {
    throw new BadRequestError('Invalid password');
  }

  const token = TokenService.generateToken(user.userId);
  return new CreatedResponse({
    message: 'User signed in successfully',
    metadata: {
      token
    }
  });
}

export default {
  signUp,
  signIn
};