import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      role: createUserDto.role ?? 'customer',
    });
  }

  async findOne(email: string) {
    return this.usersRepository.findOne({ email });
  }

  async findAll() {
    return (await this.usersRepository.find({})).map((el) => {
      delete el.password;
      return el;
    });
  }
}
