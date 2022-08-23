import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { SeedUser } from './seeder/users.seeder';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SeederModule.forFeature([SeedUser]),
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, "public/avatar")
        },
        filename(req, file, callback) {
          callback(null, Date.now() + '.'.concat(file.mimetype.split("/")[1]))
        },
      })
    })
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
