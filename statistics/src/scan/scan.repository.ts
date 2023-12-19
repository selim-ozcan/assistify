import { Injectable, Logger } from '@nestjs/common';
import { ScanDocument } from './models/scan.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '@soassistify/common';

@Injectable()
export class ScanRepository extends AbstractRepository<ScanDocument> {
  protected readonly logger = new Logger(ScanRepository.name);

  constructor(@InjectModel(ScanDocument.name) scanModel: Model<ScanDocument>) {
    super(scanModel);
  }
}
