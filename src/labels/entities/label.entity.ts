import { BelongsToMany, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Note } from "src/notes/entities/note.entity";
import { User } from "src/users/entities/user.entity";
import { NoteLabel } from "./note_label.entity";

@Table
export class Label extends Model {
  @ForeignKey(() => User)
  @Column
  user_id: string

  @Column({ allowNull: false })
  label: string

  @BelongsToMany(() => Note, () => NoteLabel)
  notes: Note[]
}
