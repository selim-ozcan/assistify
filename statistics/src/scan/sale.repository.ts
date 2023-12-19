import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '@soassistify/common';
import { SaleDocument } from './models/sale.schema';

@Injectable()
export class SaleRepository extends AbstractRepository<SaleDocument> {
  protected readonly logger = new Logger(SaleRepository.name);

  constructor(@InjectModel(SaleDocument.name) saleModel: Model<SaleDocument>) {
    super(saleModel);
  }
}
