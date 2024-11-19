import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class BallOutcomeDto {
  @IsOptional()
  @IsInt()
  runs: number | null;

  @IsString({ each: true })
  extras: string[];

  @IsBoolean()
  isWicket: boolean;

  @IsOptional()
  @IsString()
  wicketType?: string;

  @IsOptional()
  @IsString()
  fielder?: string;
}