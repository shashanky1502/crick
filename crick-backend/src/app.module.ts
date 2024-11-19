import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsModule } from './teams/teams.module';
import 'dotenv/config';
import { ConfigModule } from '@nestjs/config';
import { CricketModule } from './cricket/cricket.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ConfigModule.forRoot(),
    TeamsModule,
    CricketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}