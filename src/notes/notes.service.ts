import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { CreateNoteDTO } from './dto/create-note.dto';
import { ImagesNote } from './entities/image_note.entity';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private noteModel: typeof Note,
    @InjectModel(ImagesNote)
    private imagesNoteModel: typeof ImagesNote
  ){
    noteModel.beforeCreate((note, opt) => {
      note.id = randomUUID()
    })
  }

  async create(id: string, createNoteDto: CreateNoteDTO) {
    try {
      await this.noteModel.create({
        user_id: id,
        title: createNoteDto.title,
        content: createNoteDto.content
      });
    } catch (error) {
      throw new BadRequestException(error.errors[0].message)
    }
  }

  findAll() {
    return `This action returns all notes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
