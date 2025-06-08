import {Controller, Post, Body, Request, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {LoginDto} from './dto/login.dto';
import {ChangePasswordDto} from './dto/change-password.dto';
import {JwtAuthGuard} from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(
      req.user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
}
