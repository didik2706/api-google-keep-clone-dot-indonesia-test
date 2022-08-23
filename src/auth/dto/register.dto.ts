import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";

export class RegisterDTO {
  @ApiProperty()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  @IsNotEmpty()
  @Length(8, 20)
  password: string

  @ApiProperty()
  @IsNotEmpty()
  name: string
}