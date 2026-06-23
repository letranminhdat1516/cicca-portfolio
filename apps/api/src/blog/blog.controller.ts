import { Controller, Get, Param } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private blog: BlogService) {}

  @Get()
  list() {
    return this.blog.listPublished();
  }

  @Get(':slug')
  getOne(@Param('slug') slug: string) {
    return this.blog.getBySlug(slug);
  }
}
