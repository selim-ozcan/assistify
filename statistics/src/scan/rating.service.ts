import { Injectable } from '@nestjs/common';
import { RatingRepository } from './rating.repository';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingService {
  constructor(private readonly ratingRepository: RatingRepository) {}
  create(createRatingDto: CreateRatingDto) {
    const rating = {
      ...createRatingDto,
      rate: +createRatingDto.rate,
      created_at: new Date(),
    };
    return this.ratingRepository.create(rating);
  }

  findAll() {
    return this.ratingRepository.find({});
  }
}
