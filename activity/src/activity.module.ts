import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ConfigModule } from '@nestjs/config';
import {
  CommonAuthModule,
  DatabaseModule,
  LoggerModule,
} from '@soassistify/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonAuthModule,
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature([]),
    LoggerModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
