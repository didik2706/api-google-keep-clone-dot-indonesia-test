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

  async create(id: string, createNoteDto: CreateNoteDTO): Promise<void> {
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

  async addImages(note_id: string, user_id: string, files): Promise<void> {
    const images = files.map(d => {
      const url = d.path.split("/");
          url.shift();
      const image = url.join("/");

      return { image }
    })

    console.log(images);
    
  }

  async findAll(id: string): Promise<Note[]> {
    try {
      return await this.noteModel.findAll({
        where: { user_id: id }
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
