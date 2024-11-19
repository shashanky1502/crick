import { IsInt } from 'class-validator';

export class ExtrasDto {
  @IsInt()
  wide: number;

  @IsInt()
  noball: number;

  @IsInt()
  legbye: number;

  @IsInt()
  bye: number;
}