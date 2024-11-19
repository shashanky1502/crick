import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BallOutcome extends Document {
  @Prop()
  runs: number | null;

  @Prop({ type: [String], required: true })
  extras: string[];

  @Prop({ required: true })
  isWicket: boolean;

  @Prop()
  wicketType?: string;

  @Prop()
  fielder?: string;
}

export const BallOutcomeSchema = SchemaFactory.createForClass(BallOutcome);