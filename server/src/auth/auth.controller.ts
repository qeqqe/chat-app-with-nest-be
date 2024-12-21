import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login_DTO, Register_DTO } from './dto';
import { JwtAuthGuard } from './strategy/jwt-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Post('login')
  login(@Body() loginDTO: Login_DTO) {
    return this.authServices.login(loginDTO);
  }

  @Post('register')
  register(@Body() registerDTO: Register_DTO) {
    return this.authServices.register(registerDTO);
  }
}
