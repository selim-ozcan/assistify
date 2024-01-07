import { Injectable } from '@nestjs/common';
import { ScanRepository } from './scan.repository';
import { SaleRepository } from './sale.repository';
import { CreateScanDto } from './dto/create-scan.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { QuestionRepository } from './question.repository';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class CustomerAnalysisService {
  constructor(
    private readonly saleRepository: SaleRepository,
    private readonly scanRepository: ScanRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}

  async findAllSales(productId: string) {
    return (await this.saleRepository.find({})).filter(
      (s) => s.productId === productId,
    );
  }

  async findAllScans(productId: string) {
    return (await this.scanRepository.find({})).filter(
      (s) => s.productId === productId,
    );
  }

  async findAllQuestions(productId: string) {
    return (await this.questionRepository.find({})).filter(
      (s) => s.productId === productId,
    );
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

  createQuestion(createQuestionDto: CreateQuestionDto) {
    const question = {
      ...createQuestionDto,
      created_at: new Date(),
    };

    return this.questionRepository.create(question);
  }
}
