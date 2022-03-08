import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/orm/entities/user.entity';
import { UserService } from 'src/user/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params): Promise<User> {
    return await this.userService.findOne(params.id);
  }

  @Delete(':id')
  async remove(@Param() params) {
    await this.userService.remove(params.id);
  }
}
