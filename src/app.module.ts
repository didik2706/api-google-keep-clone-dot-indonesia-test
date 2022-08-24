import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { config } from "dotenv";
import { SeederModule } from 'nestjs-sequelize-seeder';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotesModule } from './notes/notes.module';
import { Note } from './notes/entities/note.entity';
import { ImagesNote } from './notes/entities/image_note.entity';
import { LabelsModule } from './labels/labels.module';
config();

const {
  MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_NAME
} = process.env;

@Module({
  imports: [
    UsersModule,
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: MYSQL_HOST,
      port: +MYSQL_PORT,
      username: MYSQL_USER,
      password: MYSQL_PASS,
      database: MYSQL_NAME,
      models: [User, Note, ImagesNote],
      autoLoadModels: true
    }),
    SeederModule.forRoot({
      runOnlyIfTableIsEmpty: true
    }),
    CacheModule.register({
      isGlobal: true
    }),
    AuthModule,
    NotesModule,
    LabelsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ],
})
export class AppModule {}
