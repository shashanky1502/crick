import { IsInt, IsString } from 'class-validator';

export class BattingStatsDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  runs: number;

  @IsInt()
  balls: number;

  @IsInt()
  fours: number;

  @IsInt()
  sixes: number;

  @IsInt()
  strikeRate: number;
}