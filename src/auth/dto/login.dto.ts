import { IsNotEmpty, Length } from "class-validator";

export class LoginDTO {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  @Length(8, 20)
  password: string
}