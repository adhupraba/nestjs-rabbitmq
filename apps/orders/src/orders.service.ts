import { Inject, Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrdersRepository } from "./orders.repository";
import { BILLING_SERVICE } from "./constants/services";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const session = await this.ordersRepository.startTransaction();

    try {
      const order = await this.ordersRepository.create(createOrderDto);
      await lastValueFrom(this.billingClient.emit("order_created", { createOrderDto }));
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }

  async getOrders() {
    return this.ordersRepository.find({});
  }
}
