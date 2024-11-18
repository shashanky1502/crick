import { Controller, Get, Post, Body } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResponse } from './dto/teams.dto';

@Controller('api/match')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('teams')
  getTeams(): TeamsResponse {
    return this.teamsService.getTeams();
  }

  @Post('ball')
  async handleBallOutcome(@Body() ballData: any): Promise<void> {
    console.log('Received ball data:', ballData);
    // Later, will connect to DB and save the ball data
    // for now just logging it
  }
}