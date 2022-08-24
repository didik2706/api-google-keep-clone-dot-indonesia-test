import { BelongsToMany, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Label } from "src/labels/entities/label.entity";
import { NoteLabel } from "src/labels/entities/note_label.entity";
import { User } from "src/users/entities/user.entity";
import { ImagesNote } from "./image_note.entity";

@Table
export class Note extends Model {
  @Column({ primaryKey: true })
  id: string

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  user_id: string

  @Column({ allowNull: false })
  title: string

  @Column({ allowNull: false })
  content: string

  @HasMany(() => ImagesNote)
  images: ImagesNote[]

  @BelongsToMany(() => Label, () => NoteLabel)
  labels: Label[]
}