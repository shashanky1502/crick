import { IsInt, IsString } from 'class-validator';

export class PlayerDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;
}