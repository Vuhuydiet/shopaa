import { Request, Response } from "express";
import accessServices from "../services/access.services";
import { CreatedResponse, OKResponse } from "../core/SuccessResponse";


export default {
  signUp: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    await accessServices.signUp({ username, password });
    new CreatedResponse({ message: 'User created successfully' }).send(res);
  },

  signIn: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const token = await accessServices.signIn({ username, password });
    new OKResponse({ message: 'User signed in successfully', metadata: { token } }).send(res);
  },

  signInWithOAuth: async (req: Request, res: Response) => {
    const { token } = req.user as any;
    new CreatedResponse({ message: 'User signed in successfully', metadata: { token } }).send(res);
  },

}