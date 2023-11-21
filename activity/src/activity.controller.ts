import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CommonAuthGuard } from '@soassistify/common';
import { RequestHelpDto } from './dto/request-help.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // @UseGuards(CommonAuthGuard) geçici olarak kapattım.
  @Post('help')
  requestHelp(@Body() requestHelpDto: RequestHelpDto) {
    this.activityService.requestHelp(requestHelpDto);
  }
}
