import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomerAnalysisModule } from './scan/customer-analysis.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CustomerAnalysisModule],
  controllers: [],
  providers: [],
})
export class StatisticsModule {}
