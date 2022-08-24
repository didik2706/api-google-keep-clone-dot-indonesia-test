import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User
  ){}

  async findAll(username): Promise<User[]> {
    try {
      return await this.userModel.findAll({
        attributes: ["id", "username", "name"],
        order: [["createdAt", "DESC"]],
        where: {
          username: {
            [Op.substring]: username
          }
        }
      });  
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { id },
      attributes: ["id", "username", "name", "avatar", "createdAt", "updatedAt"]
    });

    if (!user) {
      throw new NotFoundException("user not found");
    }

    if (user.avatar) {
      user.avatar = "http://localhost:3000/".concat(user.avatar)
    }

    return user;
  }

  async changeAvatar(id: string, avatar: string) {
    try {
      this.userModel.update({ avatar }, {
        where: { id }
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDTO) {
    const user = await this.userModel.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException("user not found");
    }

    await user.update({
      username: updateUserDto.username,
      name: updateUserDto.name
    })
  }

  async remove(id: string) {
    try {
      await this.userModel.destroy({
        where: { id }
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
