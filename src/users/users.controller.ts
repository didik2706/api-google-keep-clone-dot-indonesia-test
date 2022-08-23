import { Controller, Get, Body, Patch, Param, Delete, Query, UseInterceptors, CacheInterceptor, Put, Request, UseGuards, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller({
  path: "users",
  version: "1"
})
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('username') username = "") {
    const data = await this.usersService.findAll(username);

    return {
      success: true,
      message: "user successfully retrieved",
      data
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async findOne(@Request() req) {
    const user = await this.usersService.findOne(req.user.id)
    
    return {
      success: true,
      message: "user successfully retrieved",
      user
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Request() req, @Body() updateUserDto: UpdateUserDTO) {
    this.usersService.update(req.user.id, updateUserDto);

    return {
      success: true,
      message: "user successfully updated"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('avatar')
  @UseInterceptors(FileInterceptor("avatar"))
  change(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const url = file.path.split("/");
          url.shift();
    const avatar = url.join("/");

    this.usersService.changeAvatar(req.user.id, avatar);

    return {
      success: true,
      message: "avatar successfully changed"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Request() req) {
    await this.usersService.remove(req.user.id);

    return {
      success: true,
      message: "user successfully deleted"
    }
  }
}
