import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CricketController } from './cricket.controller';
import { CricketService } from './cricket.service';
import { MatchStateSchema } from './schema/match-state.schema';
import { PlayerSchema } from './schema/player.schema';
import { ExtrasSchema } from './schema/extras.schema';
import { BallOutcomeSchema } from './schema/ball-outcome.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MatchState', schema: MatchStateSchema },
      { name: 'Player', schema: PlayerSchema },
      { name: 'Extras', schema: ExtrasSchema },
      { name: 'BallOutcome', schema: BallOutcomeSchema },
    ]),
  ],
  controllers: [CricketController],
  providers: [CricketService],
})
export class CricketModule {}