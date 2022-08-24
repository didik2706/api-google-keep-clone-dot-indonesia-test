import { ApiProperty } from "@nestjs/swagger";
import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { Label } from "src/labels/entities/label.entity";
import { Note } from "src/notes/entities/note.entity";

@Table
export class User extends Model {
  @Column({ primaryKey: true })
  id: string

  @Column({ allowNull: false, unique: true })
  username: string

  @Column({ allowNull: false })
  password: string

  @Column({ allowNull: false })
  name: string

  @Column
  avatar: string

  @HasMany(() => Note)
  notes: Note[]

  @HasMany(() => Label)
  labels: Label[]
}
