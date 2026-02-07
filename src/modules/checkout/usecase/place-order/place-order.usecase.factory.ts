import ClientAdmFacadeFactory from "../../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../store-catalog/factory/facade.factory";
import CheckoutRepository from "../../repository/checkout.repository";
import PlaceOrderUseCase from "./place-order.usecase";

export default class PlaceOrderUseCaseFactory {
  static create(): PlaceOrderUseCase {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const repository = new CheckoutRepository();

    return new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      catalogFacade,
      repository
    );
  }
}
