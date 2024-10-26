import { Request, Response } from "express";
import accessServices from "../services/access.services";
import { CreatedResponse, SuccessResponse } from "../core/SuccessResponse";


export default {
  signUp: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const result = await accessServices.signUp({ username, password });
    SuccessResponse.send(res, result);
  },

  signIn: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const result = await accessServices.signIn({ username, password });
    SuccessResponse.send(res, result);
  },

  signInWithGoogle: async (req: Request, res: Response) => {
    const { token } = req.user as any;
    SuccessResponse.send(res, new CreatedResponse({ message: 'User signed in successfully', metadata: { token } }));
  },

}