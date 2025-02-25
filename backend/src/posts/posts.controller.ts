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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Request() req,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.postsService.findAll(req.user.id, +page || 1, +limit || 10);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() body: { title: string; body: string }) {
    return this.postsService.create(req.user, body.title, body.body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { title: string; body: string },
  ) {
    return this.postsService.update(req.user.id, +id, body.title, body.body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.postsService.remove(req.user, +id);
  }
}
