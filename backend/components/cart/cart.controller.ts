import { Request, Response } from "express";
import { matchedData } from "express-validator";
import CartService from "./cart.service";
import { CreatedResponse, OKResponse } from "../../core/SuccessResponse";


export default {

  createCartItem: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const cartItemData = matchedData(req) as any;
    const cartItem = await CartService.createCartItem(userId, cartItemData);
    new CreatedResponse({ message: 'Cart item created', metadata: { cartItem } }).send(res);
  },

  getCartItems: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const query = matchedData(req) as any;
    const cartItems = await CartService.getCartItems(userId, query);
    new OKResponse({ message: 'Cart items retrieved', metadata: { cartItems } }).send(res);
  },

  deleteCartItem: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const { cartItemId } = matchedData(req) as any;
    await CartService.deleteCartItem(userId, cartItemId);
    new OKResponse({ message: 'Cart item deleted' }).send(res);
  }

}