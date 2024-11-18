import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
        password: loginDto.password,
      },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    user.password = undefined;
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register() {
    return this.userRepository.find();
  }
}
