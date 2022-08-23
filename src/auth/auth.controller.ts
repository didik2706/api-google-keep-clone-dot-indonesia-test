import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';

@Controller({
  path: "auth",
  version: "1"
})
export class AuthController {
  constructor(private readonly authService: AuthService){}

  @Post("register")
  async register(@Body() registerDto: RegisterDTO) {
    await this.authService.register(registerDto);

    return {
      success: true,
      message: "user successfully registered"
    }
  }

  @Post("login")
  async login(@Body() loginDto: LoginDTO) {
    const access_token = await this.authService.login(loginDto);
    
    return {
      success: true,
      message: "user successfully logged in",
      type: "bearer",
      access_token
    }
  }
}
