import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.types';
import { User, PartialUser } from 'src/orm/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { PrivateUser, PublicUser } from './user.types';

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
  // Returns private user specifically because there is more information
  @UseGuards(AuthenticatedGuard)
  async findUser(@Req() req: RequestWithUser): Promise<PrivateUser> {
    const user = await this.userService.findById(req.user.id);
    return new PrivateUser(user);
  }

  @Get('/:id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<PublicUser> {
    return await this.userService.findById(id);
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

  ////////////
  // Update //
  ////////////

  @Post('update/:id')
  async update(@Param('id') id, @Body() user: PartialUser) {
    console.log('id:', id, 'part:', user);
    return this.userService.update(id, user);
  }

  /////////////
  // Getters //
  /////////////

  @Delete('delete/:id')
  async delete(@Param('id') id) {
    await this.userService.delete(id);
  }
}
