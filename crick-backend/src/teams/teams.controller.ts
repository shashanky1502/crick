import { Controller, Get, Post, Body } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsResponse } from './dto/teams.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  getTeams(): TeamsResponse {
    return this.teamsService.getTeams();
  }
}
