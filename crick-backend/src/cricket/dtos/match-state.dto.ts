import { IsInt, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ExtrasDto } from './extras.dto';
import { BattingStatsDto } from './batting-stats.dto';
import { BowlingStatsDto } from './bowling-stats.dto';
import { BallOutcomeDto } from './ball-outcome.dto';

export class MatchStateDto {

  @IsString()
   _id: string;

  @IsString()
  teamName: string;

  @IsString()
  opponentTeamName: string;

  @IsString()
  battingTeam: string;

  @IsString()
  fieldingTeam: string;

  @IsInt()
  totalRuns: number;

  @IsInt()
  wickets: number;

  @IsInt()
  overs: number;

  @IsInt()
  balls: number;

  @ValidateNested()
  @Type(() => ExtrasDto)
  extras: ExtrasDto;

  @IsInt()
  currentOverRuns: number;

  @ValidateNested()
  @Type(() => BattingStatsDto)
  striker: BattingStatsDto;

  @ValidateNested()
  @Type(() => BattingStatsDto)
  nonStriker: BattingStatsDto;

  @ValidateNested()
  @Type(() => BowlingStatsDto)
  bowler: BowlingStatsDto;

  @IsArray()
  @IsString({ each: true })
  commentary: string[];
}