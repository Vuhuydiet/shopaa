import { Request, Response } from "express";
import ShopService from "../services/shop.service";
import { matchedData } from "express-validator";
import { CreatedResponse, OKResponse } from "../core/SuccessResponse";


export default {

  registerShop: async (req: Request, res: Response) => {
    const { userId } = req.body.user as any;
    const { shopData } = matchedData(req);
    const newShop = await ShopService.createShop(userId, shopData);
    new CreatedResponse({ message: 'Shop created successfully', metadata: { shop: newShop } }).send(res);
  },

  getShop: async (req: Request, res: Response) => {
    const { shopId } = matchedData(req);
    const shop = await ShopService.getShopById(shopId);
    new OKResponse({ message: 'Get shop successflly', metadata: { shop } }).send(res);
  },

  updateShop: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const { shopData } = matchedData(req);
    const updatedShop = await ShopService.updateShop(userId, shopData);
    new OKResponse({ message: 'Shop updated successfully', metadata: { shop: updatedShop } }).send(res);
  },

  deleteShop: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    await ShopService.deleteShop(userId);
    new OKResponse({ message: 'Shop deleted successfully' }).send(res);
  },

}