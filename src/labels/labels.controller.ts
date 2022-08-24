import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLabelDTO } from './dto/create-label.dto';
import { UpdateLabelDTO } from './dto/update-label.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller({
  path: "labels",
  version: "1"
})
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createLabelDto: CreateLabelDTO) {
    this.labelsService.create(req.user.id, createLabelDto);

    return {
      success: true,
      message: "label successfully added"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    const labels = await this.labelsService.findAll(req.user.id);

    return {
      success: true,
      message: "label successfully retrieved",
      labels
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const label = await this.labelsService.findOne(+id, req.user.id);

    return {
      success: true,
      message: "label successfully retrieved",
      label
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLabelDto: UpdateLabelDTO, @Request() req) {
    await this.labelsService.update(+id, updateLabelDto, req.user.id);

    return {
      success: true,
      message: "label successfully updated"
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.labelsService.remove(+id, req.user.id);

    return {
      success: true,
      message: "label successfully deleted"
    }
  }
}
