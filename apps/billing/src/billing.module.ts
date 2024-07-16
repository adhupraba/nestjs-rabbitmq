import { Module } from "@nestjs/common";
import { BillingController } from "./billing.controller";
import { BillingService } from "./billing.service";
import { ConfigModule } from "@nestjs/config";
import j from "joi";
import { RmqService } from "@app/common";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./apps/billing/.env",
      validationSchema: j.object({
        RABBIT_MQ_URI: j.string().required(),
        RABBIT_MQ_BILLING_QUEUE: j.string().required(),
      }),
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService, RmqService],
})
export class BillingModule {}
