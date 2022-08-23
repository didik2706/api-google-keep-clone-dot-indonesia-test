import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from "bcrypt";
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwtService: JwtService
  ) {
    userModel.beforeCreate((user, opt) => {
      user.id = randomUUID(),
      user.password = bcrypt.hashSync(user.password, 10)
    });
  }

  async register(registerDTO: RegisterDTO): Promise<void> {
    try {
      await this.userModel.create({
        username: registerDTO.username,
        password: registerDTO.password,
        name: registerDTO.name
      })
    } catch (error) {
      throw new BadRequestException(error.errors[0].message)
    }
  }

  async login(loginDto: LoginDTO) {
    try {
      const user = await this.userModel.findOne({
        where: { username: loginDto.username }
      });

      if (user && bcrypt.compareSync(loginDto.password, user.password)) {
        return this.jwtService.sign({
          id: user.id,
          name: user.name,
          username: user.username
        });
      } else {
        throw new UnauthorizedException("username or password wrong !!")
      }
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
