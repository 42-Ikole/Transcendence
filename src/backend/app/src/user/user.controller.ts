import { Controller, Delete, Get, Param, Post, Body, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.types';
import { User, PartialUser } from 'src/orm/entities/user.entity';
import { NumberIdParam } from 'src/types/param.validation';
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
  @UseGuards(AuthenticatedGuard)
  async findUser(@Req() req: RequestWithUser): Promise<PrivateUser> {
    const user = await this.userService.findById(req.user.id);
    return new PrivateUser(user);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: Number,
  })
  async findById(@Param() params: NumberIdParam): Promise<PublicUser> {
    const user = await this.userService.findById(params.id);
    if (!user) {
      throw new NotFoundException();
    }
    return new PublicUser(user);
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
