import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLabelDTO } from './dto/create-label.dto';
import { UpdateLabelDTO } from './dto/update-label.dto';
import { Label } from './entities/label.entity';

@Injectable()
export class LabelsService {
  constructor(
    @InjectModel(Label)
    private labelModel: typeof Label
  ){}

  async create(user_id: string, createLabelDto: CreateLabelDTO): Promise<void> {
    try {
      await this.labelModel.create({
        user_id,
        label: createLabelDto.label
      });    
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(user_id: string): Promise<Label[]> {
    try {
      return this.labelModel.findAll({
        where: { user_id },
        order: [["updatedAt", "DESC"]]
      })
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number, user_id: string): Promise<Label> {
    const label = await this.labelModel.findOne({
      where: { id, user_id }
    });

    if (!label) {
      throw new NotFoundException("label not found")
    }

    return label;
  }

  async update(id: number, updateLabelDto: UpdateLabelDTO, user_id: string): Promise<void> {
    const label = await Label.findOne({
      where: { id, user_id }
    });

    if (!label) {
      throw new NotFoundException("label not found");
    }

    await label.update({
      label: updateLabelDto.label
    });
  }

  async remove(id: number, user_id: string): Promise<void> {
    const label = await Label.findOne({
      where: { id, user_id }
    });

    if (!label) {
      throw new NotFoundException("label not found");
    }

    await label.destroy();
  }
}
