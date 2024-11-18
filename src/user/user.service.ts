import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'src/response.json';

@Injectable()
export class UserService {
  private result = new Response();
  private logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  async findAll() {
    this.result.data = await this.userRepository.find();
    return this.result;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    this.result.data = user || {};
    if (!user) {
      this.result.message = 'User not found';
      this.result.statusCode = 404;
    }
    return this.result;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    this.result.data = user.data;
    if (user.data) {
      await this.userRepository.delete(id);
      this.result.message = 'User deleted successfully';
    }
    this.result.statusCode = 404;
    this.result.message = 'User not found';
    return this.result;
  }
}
