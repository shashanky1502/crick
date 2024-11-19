import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BattingStats extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  runs: number;

  @Prop({ required: true })
  balls: number;

  @Prop({ required: true })
  fours: number;

  @Prop({ required: true })
  sixes: number;

  @Prop({ required: true })
  strikeRate: number;
}

export const BattingStatsSchema = SchemaFactory.createForClass(BattingStats);