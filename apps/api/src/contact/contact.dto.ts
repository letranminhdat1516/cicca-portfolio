import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** No CR/LF: these values end up in mail headers (subject, reply_to). */
const SINGLE_LINE = /^[^\r\n]*$/;

export class ContactDto {
  @Transform(trim)
  @IsString()
  @Length(1, 80)
  @Matches(SINGLE_LINE, { message: 'name must be a single line' })
  name!: string;

  @Transform(trim)
  @IsString()
  @MaxLength(120)
  @Matches(SINGLE_LINE, { message: 'email must be a single line' })
  @IsEmail()
  email!: string;

  @Transform(trim)
  @IsString()
  @Length(10, 3000)
  message!: string;

  /** Honeypot: hidden from humans, so any value means a bot. */
  @IsOptional()
  @IsString()
  website?: string;
}
