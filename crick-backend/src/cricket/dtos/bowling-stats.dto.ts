import { IsInt, IsString } from 'class-validator';

export class BowlingStatsDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  overs: number;

  @IsInt()
  balls: number;

  @IsInt()
  runs: number;

  @IsInt()
  wickets: number;

  @IsInt()
  maidens: number;

  @IsInt()
  economy: number;
}