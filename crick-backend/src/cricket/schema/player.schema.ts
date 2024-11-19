import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Player extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);