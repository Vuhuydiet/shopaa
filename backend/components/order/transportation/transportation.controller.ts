import { Request, Response } from "express";
import { matchedData } from "express-validator";
import Transportation from "./transportation.service";
import { OKResponse } from "../../../core/SuccessResponse";

export default {

  createProvider: async (req: Request, res: Response) => {
    const provider = matchedData(req) as any;
    const newProvider = await Transportation.createProvider(provider);

    new OKResponse({ message: 'Transportation provider created', metadata: newProvider }).send(res);
  },

  getProviderByKey: async (req: Request, res: Response) => {
    const { key } = matchedData(req);
    const provider = await Transportation.getProviderByKey(key);

    new OKResponse({ metadata: provider }).send(res);
  },

  getProviderById: async (req: Request, res: Response) => {
    const { providerId } = matchedData(req);
    const provider = await Transportation.getProviderById(providerId);

    new OKResponse({ metadata: provider }).send(res);
  },

  getAllProviders: async (_req: Request, res: Response) => {
    const providers = await Transportation.getAllProviders();

    new OKResponse({ metadata: providers }).send(res);
  },

  updateProvider: async (req: Request, res: Response) => {
    const { key } = matchedData(req);
    const provider = matchedData(req) as any;
    const updatedProvider = await Transportation.updateProvider(key, provider);

    new OKResponse({ message: 'Transportation provider updated', metadata: updatedProvider }).send(res);
  }

}