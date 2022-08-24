import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Note } from './entities/note.entity';
import { ImagesNote } from './entities/image_note.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { NoteLabel } from 'src/labels/entities/note_label.entity';
import { Label } from 'src/labels/entities/label.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Note, ImagesNote, Label, NoteLabel]),
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, "public/assets")
        },
        filename(req, file, callback) {
          callback(null, Date.now() + '.'.concat(file.mimetype.split("/")[1]))
        },
      })
    })
  ],
  controllers: [NotesController],
  providers: [NotesService]
})
export class NotesModule {}
