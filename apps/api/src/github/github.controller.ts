import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GithubService } from './github.service';

@Controller('admin/github')
export class GithubController {
  constructor(private github: GithubService) {}

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh() {
    return this.github.refresh();
  }
}
