import { NestFactory } from "@nestjs/core";
import { BillingModule } from "./billing.module";
import { RmqService } from "@app/common/rmq/rmq.service";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(BillingModule);
  const rmqService = app.get<RmqService>(RmqService);
  const config = app.get(ConfigService);

  app.connectMicroservice(rmqService.getOptions(config.get<string>("RABBIT_MQ_BILLING_QUEUE")));
  await app.startAllMicroservices();
}
bootstrap();
