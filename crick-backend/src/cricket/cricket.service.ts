import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchStateDto } from './dtos/match-state.dto';
import { BallOutcomeDto } from './dtos/ball-outcome.dto';
import { MatchState } from './schema/match-state.schema';
import { generateCommentary } from './commentary.util';

@Injectable()
export class CricketService {
  constructor(
    @InjectModel(MatchState.name) private matchStateModel: Model<MatchState>,
  ) {}

  async getLatestMatchState(): Promise<MatchState> {
    return await this.matchStateModel.findOne().sort({ _id: -1 }).exec();
  }

  async processBallOutcome(matchStateDto: MatchStateDto, ballOutcomeDto: BallOutcomeDto): Promise<MatchState> {
    const { runs, extras, isWicket } = ballOutcomeDto;
    delete matchStateDto._id;
    let newMatchState = { ...matchStateDto };
    let runsToAdd = runs || 0;
    let countAsBall = true;

    // check
    if (!newMatchState.bowler) {
      throw new Error('Bowler is not defined');
    }
    if (!newMatchState.striker) {
      throw new Error('Striker is not defined');
    }
    if (!newMatchState.extras) {
      throw new Error('Extras are not defined');
    }

    // Wide + runs
    if (extras.includes("wide")) {
      runsToAdd += 1;
      countAsBall = false;
      newMatchState.extras.wide += runsToAdd;
      newMatchState.bowler.runs += 1;
      newMatchState.totalRuns += runsToAdd;
    }

    // Noball + bye
    else if (extras.includes("noball") && extras.includes("bye")) {
      runsToAdd += 1;
      countAsBall = false;
      newMatchState.extras.noball += 1;
      newMatchState.bowler.runs += 1;
      newMatchState.extras.bye += runs || 0;
      newMatchState.totalRuns += runsToAdd;
      newMatchState.striker.balls += 1;
    }

    // Noball + runs
    else if (extras.includes("noball") && runs !== null) {
      runsToAdd += 1;
      countAsBall = false;
      newMatchState.extras.noball += 1;
      newMatchState.bowler.runs += runsToAdd;
      newMatchState.striker.runs += runsToAdd - 1;
      newMatchState.totalRuns += runsToAdd;
      newMatchState.striker.balls += 1;
    }

    // Noball + legbye
    else if (extras.includes("noball") && extras.includes("legbye")) {
      runsToAdd += 1;
      countAsBall = false;
      newMatchState.extras.noball += 1;
      newMatchState.bowler.runs += 1;
      newMatchState.extras.legbye += runs || 0;
      newMatchState.totalRuns += runsToAdd;
      newMatchState.striker.balls += 1;
    }

    // Legbye/Bye + Overthrow
    else if ((extras.includes("legbye") || extras.includes("bye")) && extras.includes("overthrow")) {
      const extraType = extras.includes("legbye") ? "legbye" : "bye";
      newMatchState.extras[extraType] += runsToAdd;
      newMatchState.totalRuns += runsToAdd;
    }

    // Runs + Overthrow
    else if (runs !== null && extras.includes("overthrow")) {
      newMatchState.striker.runs += runsToAdd;
      newMatchState.totalRuns += runsToAdd;
    }

    // Normal Runs Logic
    else if (runs !== null && !isWicket) {
      newMatchState.striker.runs += runsToAdd;
      newMatchState.striker.balls += 1;
      newMatchState.bowler.runs += runsToAdd;
      newMatchState.bowler.balls += 1;
      newMatchState.totalRuns += runsToAdd;

      if (runs === 4) newMatchState.striker.fours += 1;
      if (runs === 6) newMatchState.striker.sixes += 1;
    }

    // Wicket Logic
    if (isWicket && !extras.includes("wide") && !extras.includes("noball")) {
      newMatchState.wickets += 1;
      newMatchState.bowler.wickets += 1;
    }

    // Update match state
    if (!isWicket) {
      newMatchState.currentOverRuns += runsToAdd;
    }

    if (countAsBall) {
      newMatchState.balls += 1;
      if (newMatchState.balls === 6) {
        if (newMatchState.currentOverRuns === 0) {
          newMatchState.bowler.maidens += 1;
        }
        newMatchState.bowler.overs += 1;
        newMatchState.overs += 1;
        newMatchState.balls = 0;
        newMatchState.currentOverRuns = 0;
        newMatchState.bowler.balls = 0;
      }
    }

    // Update player stats
    newMatchState.striker.strikeRate = this.calculateStrikeRate(
      newMatchState.striker.runs,
      newMatchState.striker.balls
    );
    newMatchState.bowler.economy = parseFloat(
      (
        newMatchState.bowler.runs /
        (newMatchState.bowler.overs + newMatchState.bowler.balls / 6)
      ).toFixed(2)
    );

    // Rotate strike
    if (
      (runsToAdd % 2 === 1 &&
        !extras.includes("wide") &&
        !extras.includes("noball")) ||
      (newMatchState.balls === 0 && newMatchState.overs > 0)
    ) {
      const temp = newMatchState.striker;
      newMatchState.striker = newMatchState.nonStriker;
      newMatchState.nonStriker = temp;
    }

    const commentaryText = generateCommentary(
      ballOutcomeDto,
      newMatchState.bowler.name,
      newMatchState.striker.name
    );

    newMatchState.commentary.unshift(commentaryText);

    // Save match state to DB
    const updatedMatchState = new this.matchStateModel(newMatchState);
    return await updatedMatchState.save();
  }

  private calculateStrikeRate(runs: number, balls: number): number {
    return balls === 0 ? 0 : parseFloat(((runs / balls) * 100).toFixed(2));
  }
}