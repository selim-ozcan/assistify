import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RatingService } from './rating.service';
import { CommonAuthGuard } from '@soassistify/common';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(CommonAuthGuard)
  @Post()
  create(@Body() createRatingDto: CreateRatingDto) {
    this.ratingService.create(createRatingDto);
  }

  @UseGuards(CommonAuthGuard)
  @Get()
  findAll() {
    return this.ratingService.findAll();
  }
}
