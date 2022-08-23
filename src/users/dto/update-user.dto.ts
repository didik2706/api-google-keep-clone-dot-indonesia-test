import { IsNotEmpty } from "class-validator";

export class UpdateUserDTO {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  name: string
}