import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types } from 'mongoose';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }

    return document as TDocument;
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    const filter: any = {};

    if (filterQuery.material) filter.material = { $eq: filterQuery.material };
    if (filterQuery.size) filter.sizes = { $in: [filterQuery.size] };
    if (filterQuery.color) filter.colors = { $in: [filterQuery.color] };

    return await this.model.find(filter);
  }

  async update(_id: string, updateDto: Partial<TDocument>) {
    return await this.model.findOneAndUpdate({ _id }, updateDto);
  }
}
