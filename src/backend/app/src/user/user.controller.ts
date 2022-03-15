import { Controller, Delete, Get, Param, Req, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/orm/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { userInfo } from 'os';

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

  @Get(':id')
  async findOne(@Param() params): Promise<User> {
    return await this.userService.findOne(params.id);
  }

  @Get('matches_won/:id')
  async findWinner(@Param('id') id) {
	  return await this.userService.findWins(id);
  }
 
  @Get('matches_lost/:id')
  async findLosses(@Param('id') id) {
	  return await this.userService.findLosses(id);
  }

/////////////
// Getters //
/////////////

  @Delete('delete')
  async remove(@Param() params) {
    await this.userService.remove(params.id);
  }
}
