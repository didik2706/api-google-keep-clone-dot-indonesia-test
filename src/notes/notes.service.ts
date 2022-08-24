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
    });

    ImagesNote.beforeFind((opt) => {
      opt.attributes
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

  async addImages(note_id: string, files): Promise<void> {
    try {
      const images = files.map(d => {
        const url = d.path.split("/");
            url.shift();
        const path = url.join("/");
  
        return { path, note_id }
      });
  
      await ImagesNote.bulkCreate(images);    
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
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

  async findOne(id: string): Promise<Note> {
    let note = await this.noteModel.findOne({
      where: { id },
      include: {
        model: ImagesNote
      }
    });
    
    if (note.images.length) {
      note.images.forEach(d => {
        d.path = "http://localhost:3000/".concat(d.path)
      })

      return note;
    } else {
      return note
    }
  }

  remove(id: string) {
    return `This action removes a #${id} note`;
  }
}
