import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { GithubModule } from '../github/github.module';

@Module({
  imports: [GithubModule],
  providers: [ContentService],
  controllers: [ContentController],
})
export class ContentModule {}
