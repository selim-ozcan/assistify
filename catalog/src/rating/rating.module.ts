import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { CommonAuthModule, DatabaseModule } from '@soassistify/common';
import { LoggerModule } from '@soassistify/common';
import { RatingDocument, RatingSchema } from './models/rating.schema';
import { RatingRepository } from './rating.repository';

@Module({
  imports: [
    CommonAuthModule,
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature([
      { name: RatingDocument.name, schema: RatingSchema },
    ]),
    LoggerModule,
  ],
  controllers: [RatingController],
  providers: [RatingService, RatingRepository],
})
export class RatingModule {}
