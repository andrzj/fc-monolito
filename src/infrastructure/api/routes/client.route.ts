import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../../modules/@shared/domain/value-object/address";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const facade = ClientAdmFacadeFactory.create();
  try {
    const address = new Address(
      req.body.address.street,
      req.body.address.number,
      req.body.address.complement,
      req.body.address.city,
      req.body.address.state,
      req.body.address.zipCode
    );
    const clientDto = {
      id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: address,
    };
    await facade.add(clientDto);
    res.status(201).json({
      id: clientDto.id,
      name: clientDto.name,
      email: clientDto.email,
      document: clientDto.document,
      address: {
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});
