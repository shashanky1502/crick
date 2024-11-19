import { Injectable } from '@nestjs/common';
import { Player, TeamsResponse } from './dto/teams.dto';

@Injectable()
export class TeamsService {
  private readonly teams: { name: string; players: Player[] }[] = [
    { // mock data stored here for testing purposes
      name: 'India',
      players: [
        { id: 1, name: 'Virat Kohli', team: 'India' },
        { id: 2, name: 'Rohit Sharma', team: 'India' },
        { id: 3, name: 'KL Rahul', team: 'India' },
        { id: 4, name: 'Rishabh Pant', team: 'India' },
        { id: 5, name: 'Hardik Pandya', team: 'India' },
        { id: 6, name: 'Ravindra Jadeja', team: 'India' },
        { id: 7, name: 'Jasprit Bumrah', team: 'India' },
        { id: 8, name: 'Mohammed Shami', team: 'India' },
        { id: 9, name: 'Yuzvendra Chahal', team: 'India' },
        { id: 10, name: 'Shikhar Dhawan', team: 'India' },
        { id: 11, name: 'Bhuvneshwar Kumar', team: 'India' },
      ],
    },
    {
      name: 'Australia',
      players: [
        { id: 12, name: 'Steve Smith', team: 'Australia' },
        { id: 13, name: 'David Warner', team: 'Australia' },
        { id: 14, name: 'Pat Cummins', team: 'Australia' },
        { id: 15, name: 'Mitchell Starc', team: 'Australia' },
        { id: 16, name: 'Glenn Maxwell', team: 'Australia' },
        { id: 17, name: 'Aaron Finch', team: 'Australia' },
        { id: 18, name: 'Josh Hazlewood', team: 'Australia' },
        { id: 19, name: 'Marcus Stoinis', team: 'Australia' },
        { id: 20, name: 'Alex Carey', team: 'Australia' },
        { id: 21, name: 'Nathan Lyon', team: 'Australia' },
        { id: 22, name: 'Mitchell Marsh', team: 'Australia' },
      ],
    },
  ];

  getTeams(): TeamsResponse {
    return {
      team1Name: this.teams[0].name,
      team2Name: this.teams[1].name,
      team1: this.teams[0].players,
      team2: this.teams[1].players,
    };
  }

 

}