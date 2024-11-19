import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Extras extends Document {
  @Prop({ required: true })
  wide: number;

  @Prop({ required: true })
  noball: number;

  @Prop({ required: true })
  legbye: number;

  @Prop({ required: true })
  bye: number;
}

export const ExtrasSchema = SchemaFactory.createForClass(Extras);