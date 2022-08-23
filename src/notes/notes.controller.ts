import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, CacheInterceptor, UseGuards, Request, UploadedFiles } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDTO } from './dto/create-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FilesInterceptor("images"))
  @Post(":id/images")
  async addImages(@Param("id") id: string, @Request() req, @UploadedFiles() files: Array<Express.Multer.File>) {
    await this.notesService.addImages(id, req.user.id, files)
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
  //   return this.notesService.update(+id, updateNoteDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }
}
