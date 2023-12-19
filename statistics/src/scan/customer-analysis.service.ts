import { Injectable } from '@nestjs/common';
import { ScanRepository } from './scan.repository';
import { SaleRepository } from './sale.repository';
import { CreateScanDto } from './dto/create-scan.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class CustomerAnalysisService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly scanRepository: ScanRepository,
  ) {}

  async findAllSales(productId: string) {
    return await this.saleRepository.find({ productId });
  }
  async findAllScans(productId: string) {
    return await this.scanRepository.find({ productId });
  }
  createSale(createSaleDto: CreateSaleDto) {
    const sale = {
      ...createSaleDto,
      created_at: new Date(),
    };

    return this.saleRepository.create(sale);
  }
  createScan(createScanDto: CreateScanDto) {
    const scan = {
      ...createScanDto,
      created_at: new Date(),
    };

    return this.scanRepository.create(scan);
  }
}
