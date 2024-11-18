import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) throw new NotFoundException('Token not found');
    try {
      const payload = this.jwtService.verify(token);
      this.logger.log(payload);
      const now = Date.now();
      const exp = payload.exp;
      if (!exp || now <= exp) throw new NotFoundException('Token expired');
      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) throw new NotFoundException('User not found');
      request.user = { ...user, password: undefined };
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'You are not authorized to access this resource',
      );
    }
  }
}
