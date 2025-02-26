import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Retrieve all posts for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of user posts returned successfully.',
  })
  async findAll(
    @Request() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.postsService.findAll(req.user.id, +page || 1, +limit || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully.' })
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(
      req.user,
      createPostDto.title,
      createPostDto.body,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(
      req.user.id,
      +id,
      updatePostDto.title,
      updatePostDto.body,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully.' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.postsService.remove(req.user.id, +id);
  }
}
