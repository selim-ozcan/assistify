import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ConfigModule } from '@nestjs/config';
import {
  CommonAuthModule,
  DatabaseModule,
  LoggerModule,
} from '@soassistify/common';
import { ActivityController } from './activity.controller';
import { ActivityGateway } from './activity.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonAuthModule,
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature([]),
    LoggerModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService, ActivityGateway],
})
export class ActivityModule {}
