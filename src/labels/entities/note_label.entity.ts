import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Note } from "src/notes/entities/note.entity";
import { Label } from "./label.entity";

@Table
export class NoteLabel extends Model {
  @ForeignKey(() => Label)
  @Column({ allowNull: false })
  label_id: number

  @ForeignKey(() => Note)
  @Column({ allowNull: false })
  note_id: string
}