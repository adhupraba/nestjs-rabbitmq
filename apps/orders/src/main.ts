import { NestFactory } from "@nestjs/core";
import { OrdersModule } from "./orders.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);
  const port = config.get("PORT") || 3001;

  await app.listen(port);
}
bootstrap();
