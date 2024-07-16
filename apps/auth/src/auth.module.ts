import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DatabaseModule, RmqModule } from "@app/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import j from "joi";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "./users/users.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./apps/auth/.env",
      validationSchema: j.object({
        JWT_SECRET: j.string().required(),
        JWT_EXPIRATION: j.string().required(),
        MONGODB_URI: j.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    RmqModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: config.get<string>("JWT_EXPIRATION") + "s",
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
