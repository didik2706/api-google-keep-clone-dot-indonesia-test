import { IsNotEmpty } from "class-validator";

export class CreateLabelDTO {
  @IsNotEmpty()
  label: string
}
