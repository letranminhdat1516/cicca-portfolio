import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CollectDto {
  @IsString()
  @MaxLength(512)
  path!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  referrer?: string;
}
