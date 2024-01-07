import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '@soassistify/common';
import { QuestionDocument } from './models/question.schema';

@Injectable()
export class QuestionRepository extends AbstractRepository<QuestionDocument> {
  protected readonly logger = new Logger(QuestionRepository.name);

  constructor(
    @InjectModel(QuestionDocument.name) questionModel: Model<QuestionDocument>,
  ) {
    super(questionModel);
  }
}
