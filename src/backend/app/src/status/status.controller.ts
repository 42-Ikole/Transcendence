import { Controller, Body, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { StatusService } from './status.service';

@ApiTags('status')
@Controller('status')
@UseGuards(AuthenticatedGuard)
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get()
  getStates() {
      return this.statusService.getStates();
  }
}
