import { Controller, Get } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private content: ContentService) {}

  @Get()
  getPortfolio() {
    return this.content.getPortfolio();
  }
}
