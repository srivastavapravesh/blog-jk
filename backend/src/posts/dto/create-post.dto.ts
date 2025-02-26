import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Post Title', description: 'Title of the post' })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @ApiProperty({
    example: 'This is the post content.',
    description: 'Body of the post',
  })
  @IsNotEmpty({ message: 'Body is required' })
  @IsString({ message: 'Body must be a string' })
  body: string;
}
