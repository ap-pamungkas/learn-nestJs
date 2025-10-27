import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 1. Definisikan Tipe Dokumen Mongoose
// Tipe ini akan digunakan oleh Services untuk berinteraksi dengan model.
export type ProjectDocument = Project & Document;

// 2. Definisikan Kelas Skema
@Schema()
export class Project {
  // Field: name (String, Wajib)
  @Prop({ required: true })
  name: string;

  // Field: description (String, Wajib)
  @Prop({ required: true })
  description: string;

  // Field: url (String, Opsional/Nullable)
  // Karena tidak ada `required: true`, field ini otomatis opsional.
  @Prop()
  url: string;

  // Field: image (String, Opsional/Nullable)
  @Prop()
  image: string;
}

// 3. Buat Skema dari Kelas
// Ini diperlukan untuk mendaftarkan model di MongooseModule.
export const ProjectSchema = SchemaFactory.createForClass(Project);
