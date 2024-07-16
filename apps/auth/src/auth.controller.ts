import { Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "./users/schemas/user.schema";
import { Response } from "express";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    await this.authService.login(user, res);
    res.send(user);
  }
}
