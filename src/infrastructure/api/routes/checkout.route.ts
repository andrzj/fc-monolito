import express, { Request, Response } from "express";
import PlaceOrderUseCaseFactory from "../../../modules/checkout/usecase/place-order/place-order.usecase.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  const usecase = PlaceOrderUseCaseFactory.create();
  try {
    const checkoutDto = {
      clientId: req.body.clientId,
      products: req.body.products,
    };
    const output = await usecase.execute(checkoutDto);
    res.status(201).json(output);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
