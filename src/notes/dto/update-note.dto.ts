import { PartialType } from "@nestjs/swagger";
import { CreateNoteDTO } from "./create-note.dto";

export class UpdateNoteDTO extends PartialType(CreateNoteDTO) {}