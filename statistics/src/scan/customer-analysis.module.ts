import { Module } from '@nestjs/common';
import { CustomerAnalysisService } from './customer-analysis.service';
import { CustomerAnalysisController } from './customer-analysis.controller';
import { CommonAuthModule, DatabaseModule } from '@soassistify/common';
import { LoggerModule } from '@soassistify/common';
import { ScanDocument, ScanSchema } from './models/scan.schema';
import { ScanRepository } from './scan.repository';
import { SaleRepository } from './sale.repository';
import { SaleDocument, SaleSchema } from './models/sale.schema';
import { QuestionDocument, QuestionSchema } from './models/question.schema';
import { QuestionRepository } from './question.repository';

@Module({
  imports: [
    CommonAuthModule,
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature([
      { name: ScanDocument.name, schema: ScanSchema },
      { name: SaleDocument.name, schema: SaleSchema },
      { name: QuestionDocument.name, schema: QuestionSchema },
    ]),
    LoggerModule,
  ],
  controllers: [CustomerAnalysisController],
  providers: [
    CustomerAnalysisService,
    ScanRepository,
    SaleRepository,
    QuestionRepository,
  ],
})
export class CustomerAnalysisModule {}
