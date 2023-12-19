import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CustomerAnalysisService } from './customer-analysis.service';
import { CommonAuthGuard } from '@soassistify/common';
import { CreateScanDto } from './dto/create-scan.dto';
import { CreateSaleDto } from './dto/create-sale.dto';

@Controller('statistics')
export class CustomerAnalysisController {
  constructor(
    private readonly customerAnalysisService: CustomerAnalysisService,
  ) {}

  @UseGuards(CommonAuthGuard)
  @Post('scan')
  createScan(@Body() createScanDto: CreateScanDto) {
    console.log(createScanDto);
    this.customerAnalysisService.createScan(createScanDto);
  }

  @UseGuards(CommonAuthGuard)
  @Post('sale')
  createSale(@Body() createSaleDto: CreateSaleDto) {
    this.customerAnalysisService.createSale(createSaleDto);
  }

  @UseGuards(CommonAuthGuard)
  @Get('scan/:productId')
  findAllScans(@Param() productId: string) {
    return this.customerAnalysisService.findAllScans(productId);
  }

  @UseGuards(CommonAuthGuard)
  @Get('sale/:productId')
  findAllSales(@Param() productId: string) {
    return this.customerAnalysisService.findAllSales(productId);
  }
}
