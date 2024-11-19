import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Extras, ExtrasSchema } from './extras.schema';
import { BattingStats, BattingStatsSchema } from './batting-stats.schema';
import { BowlingStats, BowlingStatsSchema } from './bowling-stats.schema';

@Schema()
export class MatchState extends Document {
  
  @Prop({ required: true })
  teamName: string;

  @Prop({ required: true })
  opponentTeamName: string;

  @Prop({ required: true })
  battingTeam: string;

  @Prop({ required: true })
  fieldingTeam: string;

  @Prop({ required: true })
  totalRuns: number;

  @Prop({ required: true })
  wickets: number;

  @Prop({ required: true })
  overs: number;

  @Prop({ required: true })
  balls: number;

  @Prop({ type: ExtrasSchema, required: true })
  extras: Extras;

  @Prop({ required: true })
  currentOverRuns: number;

  @Prop({ type: BattingStatsSchema, required: true })
  striker: BattingStats;

  @Prop({ type: BattingStatsSchema, required: true })
  nonStriker: BattingStats;

  @Prop({ type: BowlingStatsSchema, required: true })
  bowler: BowlingStats;

  @Prop({ type: [String], required: true })
  commentary: string[];
}

export const MatchStateSchema = SchemaFactory.createForClass(MatchState);