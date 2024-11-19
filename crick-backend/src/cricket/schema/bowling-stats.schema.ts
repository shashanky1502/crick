import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BowlingStats extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  overs: number;

  @Prop({ required: true })
  balls: number;

  @Prop({ required: true })
  runs: number;

  @Prop({ required: true })
  wickets: number;

  @Prop({ required: true })
  maidens: number;

  @Prop({ required: true })
  economy: number;
}

export const BowlingStatsSchema = SchemaFactory.createForClass(BowlingStats);