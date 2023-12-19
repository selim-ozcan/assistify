import { Injectable, Logger } from '@nestjs/common';
import { RatingDocument } from './models/rating.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '@soassistify/common';

@Injectable()
export class RatingRepository extends AbstractRepository<RatingDocument> {
  protected readonly logger = new Logger(RatingRepository.name);

  constructor(
    @InjectModel(RatingDocument.name) ratingModel: Model<RatingDocument>,
  ) {
    super(ratingModel);
  }
}
