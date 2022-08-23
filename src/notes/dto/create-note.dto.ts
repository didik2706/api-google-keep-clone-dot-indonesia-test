import { IsIn, IsNotEmpty } from "class-validator";

export class CreateNoteDTO{
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  content: string
}
