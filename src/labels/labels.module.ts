import { Module } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { LabelsController } from './labels.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Label } from './entities/label.entity';
import { NoteLabel } from './entities/note_label.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Label, NoteLabel])
  ],
  controllers: [LabelsController],
  providers: [LabelsService]
})
export class LabelsModule {}
