import { IsNotEmpty, IsPositive } from "class-validator";

export class AddLabelDTO {
  @IsNotEmpty()
  label_id: number
}