import { Controller, Get, Post, Body } from '@nestjs/common';
import { CricketService } from './cricket.service';
import { MatchStateDto } from './dtos/match-state.dto';
import { BallOutcomeDto } from './dtos/ball-outcome.dto';
import { MatchState } from './schema/match-state.schema';

@Controller('cricket')
export class CricketController {
  constructor(private readonly cricketService: CricketService) {}

  @Get('latest')
  async getLatestMatchState(): Promise<MatchState> {
    return this.cricketService.getLatestMatchState();
  }

  @Post('ball')
  async processBallOutcome(
    @Body('matchState') matchStateDto: MatchStateDto,
    @Body('ballOutcome') ballOutcomeDto: BallOutcomeDto
  ): Promise<MatchState> {
    return this.cricketService.processBallOutcome(matchStateDto, ballOutcomeDto);
  }
}