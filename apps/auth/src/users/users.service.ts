import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import bcrypt from "bcrypt";
import { User } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    await this.validateCreateUserRequest(createUserDto);

    const user = await this.usersRepo.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    return user;
  }

  private async validateCreateUserRequest(req: CreateUserDto) {
    let user: User;

    try {
      user = await this.usersRepo.findOne({ email: req.email });
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException("Email already exists");
    }
  }
}
