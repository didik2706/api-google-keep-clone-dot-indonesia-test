import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { CreateNoteDTO } from './dto/create-note.dto';
import { ImagesNote } from './entities/image_note.entity';
import { Note } from './entities/note.entity';
import { unlinkSync } from "fs";
import { join } from "path";
import { UpdateNoteDTO } from './dto/update-note.dto';

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

  async findOne(id: string, user_id: string): Promise<Note> {
    let note = await this.noteModel.findOne({
      where: { id, user_id },
      include: {
        model: ImagesNote
      }
    });

    if (!note) {
      throw new NotFoundException("note not found")
    }
    
    if (note.images.length) {
      note.images.forEach(d => {
        d.path = "http://localhost:3000/".concat(d.path)
      })

      return note;
    } else {
      return note
    }
  }

  async update(id: string, user_id: string, updateNoteDto: UpdateNoteDTO): Promise<void> {
    try {
      const note = await Note.findOne({
        where: { id, user_id }
      });
  
      if (!note) {
        throw new NotFoundException("note not found");
      }
  
      note.update({
        title: updateNoteDto.title,
        content: updateNoteDto.content
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeImage(id: number): Promise<void> {
    try {
      const image = await ImagesNote.findOne({
        where: { id }
      });

      if (!image) {
        throw new NotFoundException("note image not found");
      }

      unlinkSync(join(__dirname, "../../public/" + image.path));

      await image.destroy();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string, user_id: string): Promise<void> {
    try {
      const note = await Note.findOne({
        where: { id, user_id },
        include: {
          model: ImagesNote
        }
      });

      if (!note) {
        throw new NotFoundException("note not found");
      }
  
      if (note.images.length) {
        note.images.forEach(d => {
          unlinkSync(join(__dirname, "../../public/" + d.path));
        });
  
        await note.destroy();
      } else {
        await note.destroy();
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
