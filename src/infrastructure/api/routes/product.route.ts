import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
  const facade = ProductAdmFacadeFactory.create();
  try {
    const productDto = {
      id: req.body.id,
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };
    await facade.addProduct(productDto);
    res.status(201).json(productDto);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
