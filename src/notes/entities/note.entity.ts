import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "src/users/entities/user.entity";
import { ImagesNote } from "./image_note.entity";

@Table
export class Note extends Model {
  @Column({ primaryKey: true })
  id: string

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  user_id: string

  @Column({ allowNull: false, unique: true })
  title: string

  @Column({ allowNull: false })
  content: string

  @HasMany(() => ImagesNote)
  images: ImagesNote[]
}