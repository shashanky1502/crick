export interface Player {
    id: number;
    name: string;
    team: string;
  }
  
  export interface TeamsResponse {
    team1Name: string;
    team2Name: string;
    team1: Player[];
    team2: Player[];
  }