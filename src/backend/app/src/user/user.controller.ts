import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
  Patch,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.types';
import { User, PartialUser } from 'src/orm/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { PrivateUser, PublicUser } from './user.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';
import { createReadStream } from 'fs';
import { join } from 'path';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  ////////////
  // Create //
  ////////////

  @Post('create')
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  /////////////
  // Getters //
  /////////////

  @Get('all')
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get()
  @UseGuards(AuthenticatedGuard)
  async findUser(@Req() req: RequestWithUser): Promise<PrivateUser> {
    const user = await this.userService.findById(req.user.id);
    return new PrivateUser(user);
  }

  @Get('/:id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<PublicUser> {
    return new PublicUser(await this.userService.findById(id));
  }

  @Get('findIntraId/:id')
  async findByIntraId(@Param('id') id): Promise<User> {
    return await this.userService.findByIntraId(id);
  }

  @Get('matches_won/:id')
  async findWinner(@Param('id') id) {
    return await this.userService.findWins(id);
  }

  @Get('matches_lost/:id')
  async findLosses(@Param('id') id) {
    return await this.userService.findLosses(id);
  }

  @Patch('update')
  async updateUser(@Req() request: RequestWithUser, @Body() user: PartialUser) {
    return await this.userService.update(request.user.id, user);
  }

  @Post('uploadAvatar')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.addAvatar(request.user.id, {
      filename: file.originalname,
      data: file.buffer,
    });
  }

  @Get('avatar/:id/:hahagetrektbitch')
  async getAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const file = await this.userService.getAvatarById(id);
      const stream = Readable.from(file.data);
      response.set({
        'Content-Disposition': `inline; filename="${file.filename}"`,
        'Content-Type': 'image',
      });
      return new StreamableFile(stream);
    } catch (error) {
      const file = createReadStream(
        join(process.cwd(), 'src/avatar/default_avatar.jpeg'),
      );
      response.set({
        'Content-Type': 'image/jpeg',
        'Content-Disposition': 'inline; filename="default avatar"',
      });
      return new StreamableFile(file);
    }
  }

  /////////////
  // Getters //
  /////////////

  @Delete('delete/:id')
  async delete(@Param('id') id) {
    await this.userService.delete(id);
  }
}
