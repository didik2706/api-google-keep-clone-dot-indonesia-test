import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { CreateNoteDTO } from './dto/create-note.dto';
import { ImagesNote } from './entities/image_note.entity';
import { Note } from './entities/note.entity';
import { unlinkSync } from "fs";
import { join } from "path";
import { UpdateNoteDTO } from './dto/update-note.dto';
import { NoteLabel } from 'src/labels/entities/note_label.entity';
import { AddLabelDTO } from './dto/add-label.dto';
import { Label } from 'src/labels/entities/label.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note)
    private noteModel: typeof Note,
    @InjectModel(ImagesNote)
    private imagesNoteModel: typeof ImagesNote,
    @InjectModel(NoteLabel)
    private noteLabelModel: typeof NoteLabel,
    @InjectModel(Label)
    private labelModel: typeof Label
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

  async addLabel(addLabelDto: AddLabelDTO, note_id: string, user_id: string): Promise<void> {
    const note = await this.noteModel.findOne({
      where: { user_id, id: note_id },
      include: {
        model: this.labelModel
      }
    });

    const labels = await this.labelModel.findOne({
      where: { id: addLabelDto.label_id, user_id }
    })

    if (!note) {
      throw new NotFoundException("note not found")
    } else if (note.labels.filter(d => d.id == addLabelDto.label_id).length) {
      throw new BadRequestException("label is already exist");
    } else if (!labels) {
      throw new BadRequestException("user don't have this label");
    }

    await this.noteLabelModel.create({
      note_id,
      label_id: addLabelDto.label_id
    });
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
      include: [
        {
          model: this.imagesNoteModel
        },
        {
          model: Label
        }
      ]
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
  }

  async removeLabel(note_id: string, label_id: number):Promise<void> {
    const noteLabel = await this.noteLabelModel.findOne({
      where: { label_id, note_id }
    })

    if (!noteLabel) {
      throw new NotFoundException("note label not found")
    }

    await noteLabel.destroy();
  }

  async removeImage(id: number): Promise<void> {
    const image = await this.imagesNoteModel.findOne({
      where: { id }
    });

    if (!image) {
      throw new NotFoundException("note image not found");
    }

    unlinkSync(join(__dirname, "../../public/" + image.path));

    await image.destroy();
  }

  async remove(id: string, user_id: string): Promise<void> {
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
  }
}
