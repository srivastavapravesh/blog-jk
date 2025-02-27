import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ProviderType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

export class LoginDto {
  @ApiProperty({ enum: ProviderType, description: 'Authentication provider (google or facebook)' })
  @IsEnum(ProviderType, { message: 'Provider must be either google or facebook' })
  provider: ProviderType;

  @ApiProperty({ description: 'Unique provider ID (Google/Facebook user ID)' })
  @IsString()
  @IsNotEmpty({ message: 'Provider ID is required' })
  token: string;

  // @ApiProperty({ description: 'User email address' })
  // @IsEmail({}, { message: 'Email must be a valid email address' })
  // email: string;

  // @ApiProperty({ description: 'User full name' })
  // @IsString()
  // @IsNotEmpty({ message: 'Name is required' })
  // name: string;
}
