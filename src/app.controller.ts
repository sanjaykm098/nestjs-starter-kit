import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './dto/auth';
import { GetUser } from './dto/get-user.decorator';
import { Response } from './response.json';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  getHello(@Body(ValidationPipe) loginUserDto: LoginDto) {
    return this.appService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('login')
  async register(@GetUser() user: any) {
    const users = await this.appService.register();
    const data = {
      user,
      users,
    };
    const res = new Response(data, 200, 'success');
    const result = res.send();
    return result;
  }
}
