import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Note } from "./note.entity";

@Table
export class ImagesNote extends Model {
  @Column({ allowNull: false })
  path: string

  @ForeignKey(() => Note)
  @Column({ allowNull: false })
  note_id: string
}