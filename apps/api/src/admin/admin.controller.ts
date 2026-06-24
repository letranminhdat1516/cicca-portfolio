import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('profile')
  getProfile() {
    return this.admin.getProfile();
  }

  @Patch('profile')
  updateProfile(@Body() data: Record<string, unknown>) {
    return this.admin.updateProfile(data);
  }

  @Get('seo')
  getSeo() {
    return this.admin.getSeo();
  }

  @Patch('seo')
  updateSeo(@Body() data: Record<string, unknown>) {
    return this.admin.updateSeo(data);
  }

  @Get(':model')
  list(@Param('model') model: string) {
    return this.admin.list(model);
  }

  @Post(':model')
  create(@Param('model') model: string, @Body() data: Record<string, unknown>) {
    return this.admin.create(model, data);
  }

  @Patch(':model/:id')
  update(
    @Param('model') model: string,
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.admin.update(model, id, data);
  }

  @Delete(':model/:id')
  remove(@Param('model') model: string, @Param('id') id: string) {
    return this.admin.remove(model, id);
  }
}
