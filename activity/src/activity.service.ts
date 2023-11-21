import { Injectable } from '@nestjs/common';
import { RequestHelpDto } from './dto/request-help.dto';
import { ActivityGateway } from './activity.gateway';

@Injectable()
export class ActivityService {
  constructor(private readonly activityGateway: ActivityGateway) {}

  async requestHelp(requestHelpDto: RequestHelpDto) {
    this.activityGateway.server.emit('help-requested', requestHelpDto);
  }
}
