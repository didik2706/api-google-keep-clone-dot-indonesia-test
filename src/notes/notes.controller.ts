import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, CacheInterceptor, UseGuards, Request, UploadedFiles, Put } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDTO } from './dto/create-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateNoteDTO } from './dto/update-note.dto';
import { AddLabelDTO } from './dto/add-label.dto';

@Controller({
  path: "notes",
  version: "1"
})
@UseInterceptors(CacheInterceptor)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req,@Body() createNoteDto: CreateNoteDTO) {
    await this.notesService.create(req.user.id, createNoteDto);

    return {
      success: true,
      message: "note successfully added"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/label")
  async addLabel(@Param("id") id: string, @Request() req,@Body() addLabelDto: AddLabelDTO) {
    await this.notesService.addLabel(addLabelDto, id, req.user.id);

    return {
      success: true,
      message: "label successfully added"
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor("images"))
  @Post(":id/images")
  async addImages(@Param("id") id: string, @UploadedFiles() files: Array<Express.Multer.File>) {
    await this.notesService.addImages(id, files);

    return {
      success: true,
      message: "note images successfully added"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    const notes = await this.notesService.findAll(req.user.id);

    return {
      success: true,
      message: "notes successfully retrieved",
      notes
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const note = await this.notesService.findOne(id, req.user.id);

    return {
      success: true,
      message: "note successfully retrieved",
      note
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(@Param("id") id: string, @Request() req, @Body() updateNoteDto: UpdateNoteDTO) {
    await this.notesService.update(id, req.user.id, updateNoteDto);

    return {
      success: true,
      message: "note successfully updated"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/label/:label_id")
  async deleteLabel(@Param() params) {
    await this.notesService.removeLabel(params.id, params.label_id)

    return {
      success: true,
      message: "note label successfully deleted"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id/image")
  async deleteImageNote(@Param("id") id: string) {
    await this.notesService.removeImage(+id);

    return {
      success: true,
      message: "note image successfully deleted"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.notesService.remove(id, req.user.id);

    return {
      success: true,
      message: "note successfully deleted"
    }
  }
}
