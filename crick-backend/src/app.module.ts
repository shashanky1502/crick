import { Module } from '@nestjs/common';
import { TeamsModule } from './teams/teams.module';


@Module({
  imports: [TeamsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
